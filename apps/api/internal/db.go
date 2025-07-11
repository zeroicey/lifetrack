package internal

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/zeroicey/lifetrack-api/internal/config"
)

func NewDB(ctx context.Context) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, config.DBURL)
	if err != nil {
		return nil, err
	}
	return pool, nil
}
