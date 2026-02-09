package utils

import (
	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Success    bool        `json:"success"`
	StatusCode int         `json:"statusCode"`
	Message    string      `json:"message,omitempty"`
	Data       interface{} `json:"data,omitempty"`
	Error      interface{} `json:"error,omitempty"`
}

func SendSuccess(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, APIResponse{
		Success:    true,
		StatusCode: statusCode,
		Message:    message,
		Data:       data,
	})
}

func SendError(c *gin.Context, statusCode int, message string, err error) {
	var errMsg interface{}
	if err != nil {
		errMsg = err.Error()
	}
	c.JSON(statusCode, APIResponse{
		Success:    false,
		StatusCode: statusCode,
		Message:    message,
		Error:      errMsg,
	})
}
