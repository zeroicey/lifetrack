package taskgroup

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

// Service 封装了与任务组相关的业务逻辑
type Service struct {
	Q *repository.Queries
}

// ErrTaskGroupNotFound 是一个哨兵错误，在未找到任务组时返回
var ErrTaskGroupNotFound = errors.New("task group not found")

// NewService 创建一个新的 Service 实例
func NewService(q *repository.Queries) *Service {
	return &Service{Q: q}
}

// ----------------------------------------------------------------------------
// 统一的查询逻辑 (Unified Query Logic)
// ----------------------------------------------------------------------------

// ListGroups 根据提供的参数（名称或类型）搜索任务组列表
// 这是对 ListGroupsByType 和 GetGroupByName(返回列表)的统一和重构
func (s *Service) ListGroups(ctx context.Context, params types.ListGroupsParams) ([]types.TaskGroupResponse, error) {
	var (
		groups []repository.TaskGroup
		err    error
	)

	// 根据参数调用不同的数据库查询
	if params.Name != nil {
		// 按名称搜索（业务上假定唯一，但接口统一返回列表）
		group, err_ := s.Q.GetTaskGroupByName(ctx, *params.Name)
		if err_ != nil {
			if errors.Is(err_, pgx.ErrNoRows) {
				return []types.TaskGroupResponse{}, nil // 未找到，返回空列表，而非错误
			}
			return nil, err_
		}
		groups = append(groups, group)
	} else if params.Type != nil {
		// 按类型搜索
		groupType, err_ := s.parseType(*params.Type)
		if err_ != nil {
			return nil, err_ // 无效的类型输入
		}
		groups, err = s.Q.GetTaskGroupsByType(ctx, groupType)
	} else {
		// 无参数，获取所有
		groups, err = s.Q.GetAllTaskGroups(ctx)
	}

	if err != nil {
		return nil, err
	}

	// 统一的结果转换
	return s.convertGroupRowsToResponse(groups), nil
}

// ListGroupsWithTasks 根据提供的参数搜索任务组列表，并附带其所有任务
// 教学提示：此实现存在 N+1 查询问题（1次查询获取组，N次查询获取每个组的任务）。
// 在高并发或大数据量场景下，这会严重影响性能。
// 优化建议：
// 1. (最佳) 在 repository 层使用 SQL JOIN 一次性查询出所有数据。
// 2. (次佳) 在 service 层先获取所有 group ID，然后用 "WHERE group_id IN (...)" 一次性查询所有相关任务，最后在内存中进行匹配。
func (s *Service) ListGroupsWithTasks(ctx context.Context, params types.ListGroupsParams) ([]types.TaskGroupWithTasksResponse, error) {
	var (
		groups []repository.TaskGroup
		err    error
	)

	// 步骤 1: 获取基础的任务组列表 (重用 ListGroups 的内部逻辑)
	if params.Name != nil {
		group, err_ := s.Q.GetTaskGroupByName(ctx, *params.Name)
		if err_ != nil {
			if errors.Is(err_, pgx.ErrNoRows) {
				return []types.TaskGroupWithTasksResponse{}, nil // 未找到，返回空列表
			}
			return nil, err_
		}
		groups = append(groups, group)
	} else if params.Type != nil {
		groupType, err_ := s.parseType(*params.Type)
		if err_ != nil {
			return nil, err_
		}
		groups, err = s.Q.GetTaskGroupsByType(ctx, groupType)
	} else {
		groups, err = s.Q.GetAllTaskGroups(ctx)
	}

	if err != nil {
		return nil, err
	}

	if len(groups) == 0 {
		return []types.TaskGroupWithTasksResponse{}, nil
	}

	// 步骤 2: 为每个任务组获取其任务并构建最终响应
	responses := make([]types.TaskGroupWithTasksResponse, 0, len(groups))
	for _, group := range groups {
		// 步骤 2a: 获取当前组的所有任务 (这是 N+1 问题中的 "+1" 查询)
		tasks, err := s.Q.GetTasksByGroupId(ctx, group.ID)
		if err != nil {
			// 如果获取单个组的任务失败，应中断并返回错误，因为调用者期望获得完整或无数据
			return nil, err
		}

		// 步骤 2b: 使用已有的辅助函数转换和组装响应
		groupResponse := s.convertToTaskGroupResponse(group)
		groupWithTasks := s.populateTasksForGroup(groupResponse, tasks)
		responses = append(responses, groupWithTasks)
	}

	return responses, nil
}

// ----------------------------------------------------------------------------
// 单个资源获取 (Single Resource Retrieval)
// ----------------------------------------------------------------------------

// GetGroupByID 通过其唯一ID获取单个任务组
func (s *Service) GetGroupByID(ctx context.Context, id int64) (types.TaskGroupResponse, error) {
	group, err := s.Q.GetTaskGroupById(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return types.TaskGroupResponse{}, ErrTaskGroupNotFound
		}
		return types.TaskGroupResponse{}, err
	}
	return s.convertToTaskGroupResponse(group), nil
}

// GetGroupWithTasksByID 通过其唯一ID获取单个任务组及其所有任务
// 推荐：未来可以优化为 sqlc 的 JOIN 查询，以减少数据库交互次数
func (s *Service) GetGroupWithTasksByID(ctx context.Context, id int64) (types.TaskGroupWithTasksResponse, error) {
	groupInfo, err := s.Q.GetTaskGroupById(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return types.TaskGroupWithTasksResponse{}, ErrTaskGroupNotFound
		}
		return types.TaskGroupWithTasksResponse{}, err
	}

	tasks, err := s.Q.GetTasksByGroupId(ctx, id)
	if err != nil {
		return types.TaskGroupWithTasksResponse{}, err
	}

	return s.populateTasksForGroup(
		s.convertToTaskGroupResponse(groupInfo),
		tasks,
	), nil
}

// ----------------------------------------------------------------------------
// 写入操作 (Write Operations)
// ----------------------------------------------------------------------------

// CreateGroup 创建一个新的任务组
func (s *Service) CreateGroup(ctx context.Context, params repository.CreateTaskGroupParams) (types.TaskGroupResponse, error) {
	// 参数校验可以在这里添加
	// ...

	group, err := s.Q.CreateTaskGroup(ctx, params)
	if err != nil {
		// 这里可以处理特定的数据库错误，例如唯一性约束冲突
		return types.TaskGroupResponse{}, err
	}
	return s.convertToTaskGroupResponse(group), nil
}

// UpdateGroup 更新一个已有的任务组
// 注意：移除了更新前多余的 checkGroupExists 调用
func (s *Service) UpdateGroup(ctx context.Context, params repository.UpdateTaskGroupByIdParams) (types.TaskGroupResponse, error) {
	group, err := s.Q.UpdateTaskGroupById(ctx, params)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// 如果更新操作返回 ErrNoRows，说明ID不存在
			return types.TaskGroupResponse{}, ErrTaskGroupNotFound
		}
		return types.TaskGroupResponse{}, err
	}
	return s.convertToTaskGroupResponse(group), nil
}

// DeleteGroup 删除一个任务组
// 注意：移除了删除前多余的 checkGroupExists 调用
func (s *Service) DeleteGroup(ctx context.Context, id int64) error {
	// sqlc 生成的 Exec 方法会返回一个 CommandTag，可以检查受影响的行数
	// 但为了简化，我们直接依赖 DeleteTaskGroupById 在找不到时是否返回错误
	// 如果 sqlc 配置为不返回错误，则需要检查受影响的行数
	err := s.Q.DeleteTaskGroupById(ctx, id)
	// 假设：如果没找到可删除的行，sqlc方法会返回 pgx.ErrNoRows 或类似的错误。
	// 如果它不返回错误，那么这个操作就是幂等的，也很好。
	return err
}

// ----------------------------------------------------------------------------
// 辅助函数和转换器 (Helpers & Converters)
// ----------------------------------------------------------------------------

// populateTasksForGroup 是一个纯函数，用于组装带有任务的任务组响应
func (s *Service) populateTasksForGroup(group types.TaskGroupResponse, tasks []repository.Task) types.TaskGroupWithTasksResponse {
	return types.TaskGroupWithTasksResponse{
		TaskGroupResponse: group,
		Tasks:             s.convertTaskRowsToResponse(tasks),
	}
}

// convertGroupRowsToResponse 将数据库中的 TaskGroup 行切片转换为响应切片 - 抽象了重复的循环
func (s *Service) convertGroupRowsToResponse(groups []repository.TaskGroup) []types.TaskGroupResponse {
	responses := make([]types.TaskGroupResponse, len(groups))
	for i, group := range groups {
		responses[i] = s.convertToTaskGroupResponse(group)
	}
	return responses
}

// convertTaskRowsToResponse 将数据库中的 Task 行切片转换为响应切片
func (s *Service) convertTaskRowsToResponse(tasks []repository.Task) []types.TaskResponse {
	responses := make([]types.TaskResponse, len(tasks))
	for i, task := range tasks {
		responses[i] = s.convertToTaskResponse(task)
	}
	return responses
}

// convertToTaskGroupResponse 将单个数据库模型转换为API响应模型
func (s *Service) convertToTaskGroupResponse(g repository.TaskGroup) types.TaskGroupResponse {
	return types.TaskGroupResponse{
		ID:          g.ID,
		Name:        g.Name,
		Description: g.Description,
		Type:        string(g.Type),
		CreatedAt:   s.pgTimestampToString(g.CreatedAt),
		UpdatedAt:   s.pgTimestampToString(g.UpdatedAt),
	}
}

// convertToTaskResponse 将单个数据库模型转换为API响应模型
func (s *Service) convertToTaskResponse(t repository.Task) types.TaskResponse {
	return types.TaskResponse{
		ID:        t.ID,
		GroupID:   t.GroupID,
		Content:   t.Content,
		Status:    string(t.Status),
		Deadline:  s.pgTimestampToString(t.Deadline),
		CreatedAt: s.pgTimestampToString(t.CreatedAt),
		UpdatedAt: s.pgTimestampToString(t.UpdatedAt),
	}
}

// pgTimestampToString 是一个更通用的转换器
func (s *Service) pgTimestampToString(pt pgtype.Timestamptz) string {
	if !pt.Valid {
		return ""
	}
	return pt.Time.Format(time.RFC3339)
}

// parseType 验证并转换类型字符串
func (s *Service) parseType(typeStr string) (repository.TaskGroupType, error) {
	normalizedType := repository.TaskGroupType(strings.ToLower(strings.TrimSpace(typeStr)))
	switch normalizedType {
	case repository.TaskGroupTypeDay, repository.TaskGroupTypeWeek, repository.TaskGroupTypeMonth, repository.TaskGroupTypeYear, repository.TaskGroupTypeCustom:
		return normalizedType, nil
	default:
		return "", errors.New("invalid task group type")
	}
}
