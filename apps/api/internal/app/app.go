package app

import (
	"github.com/zeroicey/lifetrack-api/internal/modules/memo"
)

type AppServices struct {
	Memo *memo.Service
}
