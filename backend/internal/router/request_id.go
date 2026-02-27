package router

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RequestIDMiddleware generates a unique ID for each request
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = uuid.New().String()
		}

		// Set in header for response
		c.Header("X-Request-ID", requestID)

		// Set in context for other middlewares/handlers
		c.Set("requestID", requestID)

		c.Next()
	}
}
