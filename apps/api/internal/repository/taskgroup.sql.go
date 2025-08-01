// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: taskgroup.sql

package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const createTaskGroup = `-- name: CreateTaskGroup :one
INSERT INTO task_groups (name, description)
VALUES ($1, $2)
RETURNING id, name, description, created_at, updated_at
`

type CreateTaskGroupParams struct {
	Name        string      `json:"name"`
	Description pgtype.Text `json:"description"`
}

func (q *Queries) CreateTaskGroup(ctx context.Context, arg CreateTaskGroupParams) (TaskGroup, error) {
	row := q.db.QueryRow(ctx, createTaskGroup, arg.Name, arg.Description)
	var i TaskGroup
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteTaskGroupById = `-- name: DeleteTaskGroupById :exec
DELETE FROM task_groups
WHERE id = $1
`

func (q *Queries) DeleteTaskGroupById(ctx context.Context, id int64) error {
	_, err := q.db.Exec(ctx, deleteTaskGroupById, id)
	return err
}

const getAllTaskGroups = `-- name: GetAllTaskGroups :many
SELECT id, name, description, created_at, updated_at FROM task_groups ORDER BY name ASC
`

func (q *Queries) GetAllTaskGroups(ctx context.Context) ([]TaskGroup, error) {
	rows, err := q.db.Query(ctx, getAllTaskGroups)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []TaskGroup
	for rows.Next() {
		var i TaskGroup
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getTaskGroupById = `-- name: GetTaskGroupById :one
SELECT id, name, description, created_at, updated_at FROM task_groups WHERE id = $1
`

func (q *Queries) GetTaskGroupById(ctx context.Context, id int64) (TaskGroup, error) {
	row := q.db.QueryRow(ctx, getTaskGroupById, id)
	var i TaskGroup
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const taskGroupExists = `-- name: TaskGroupExists :one
SELECT EXISTS(
    SELECT 1 FROM task_groups WHERE id = $1
) AS exists
`

func (q *Queries) TaskGroupExists(ctx context.Context, id int64) (bool, error) {
	row := q.db.QueryRow(ctx, taskGroupExists, id)
	var exists bool
	err := row.Scan(&exists)
	return exists, err
}

const updateTaskGroupById = `-- name: UpdateTaskGroupById :one
UPDATE task_groups
SET
    name = $1,
    description = $2
WHERE
    id = $3
RETURNING id, name, description, created_at, updated_at
`

type UpdateTaskGroupByIdParams struct {
	Name        string      `json:"name"`
	Description pgtype.Text `json:"description"`
	ID          int64       `json:"id"`
}

func (q *Queries) UpdateTaskGroupById(ctx context.Context, arg UpdateTaskGroupByIdParams) (TaskGroup, error) {
	row := q.db.QueryRow(ctx, updateTaskGroupById, arg.Name, arg.Description, arg.ID)
	var i TaskGroup
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
