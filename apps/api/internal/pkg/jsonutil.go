package pkg

import "encoding/json"

func MarshalJSONB[T any](val T) ([]byte, error) {
	if v, ok := any(val).([]byte); ok && len(v) == 0 {
		return nil, nil
	}
	return json.Marshal(val)
}

func UnmarshalJSONB[T any](data []byte) (T, error) {
	var v T
	if len(data) == 0 || string(data) == "null" {
		return v, nil
	}
	err := json.Unmarshal(data, &v)
	return v, err
}
