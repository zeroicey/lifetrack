package response

import (
	"encoding/json"
	"net/http"
)

type Result struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data any    `json:"data,omitempty"`
}

// 返回成功
func Success(w http.ResponseWriter, data any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Result{
		Code: 0,
		Msg:  "success",
		Data: data,
	})
}

// 返回失败
func Error(w http.ResponseWriter, code int, err error) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)
	msg := ""
	if err != nil {
		msg = err.Error()
	}
	json.NewEncoder(w).Encode(Result{
		Code: code,
		Msg:  msg,
	})
}
