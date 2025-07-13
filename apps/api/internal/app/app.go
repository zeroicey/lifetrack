package app

import (
	"github.com/zeroicey/lifetrack-api/internal/modules/memo"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskGroup"
)

type AppServices struct {
	Memo      *memo.Service
	TaskGroup *taskGroup.Service
}
