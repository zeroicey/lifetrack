package memo

type Memo struct {
	ID      int
	Content string
	// ... 其他字段
}

// DB操作可写在这里或拆到 repo.go
