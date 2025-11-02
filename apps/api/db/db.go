package db

import (
	"context"

	"github.com/gofiber/fiber/v2/log"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/zeroicey/lifetrack-api/db/dao"
)

func MustConnect(URL string) *dao.Queries {
	ctx := context.Background()
	dbConn, err := pgxpool.New(ctx, URL)
	if err != nil {
		log.Panicf("failed to initialize database connection: %v", err)
	}

	if err := dbConn.Ping(ctx); err != nil {
		log.Panicf("failed to ping database: %v", err)
	}

	log.Info("✅ Connected to database")

	return dao.New(dbConn)
}
