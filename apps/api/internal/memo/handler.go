package memo

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
)

func MemoRouter() chi.Router {
	r := chi.NewRouter()
	r.Get("/memos", ListMemos)
	r.Post("/", CreateMemo)
	r.Get("/{id}", GetMemo)
	r.Put("/{id}", UpdateMemo)
	r.Delete("/{id}", DeleteMemo)

	return r
}

func ListMemos(w http.ResponseWriter, r *http.Request) {
	response.Success(w, "List of memos") // 这里可以替换为实际的查询逻辑
}
func CreateMemo(w http.ResponseWriter, r *http.Request) { /* ... */ }
func GetMemo(w http.ResponseWriter, r *http.Request)    { /* ... */ }
func UpdateMemo(w http.ResponseWriter, r *http.Request) { /* ... */ }
func DeleteMemo(w http.ResponseWriter, r *http.Request) { /* ... */ }
