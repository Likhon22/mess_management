package router

import (
	"amar-dera/pkg/utils"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

// LoggerMiddleware logs request details to daily files
func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start timer
		start := time.Now()
		path := c.Request.URL.Path
		method := c.Request.Method

		// Process request
		c.Next()

		// End timer
		latency := time.Since(start)
		statusCode := c.Writer.Status()
		clientIP := c.ClientIP()
		requestID, _ := c.Get("requestID")
		reqIDStr, ok := requestID.(string)
		if !ok {
			reqIDStr = "UNKNOWN"
		}

		// Determine Level
		level := utils.GetLogLevel(statusCode)

		// Get Log Path
		logPath := utils.GetLogFilePath()

		// Ensure directory exists
		if err := utils.EnsureLogDir(logPath); err != nil {
			return // Silently fail if we can't create log dir
		}

		// Format message
		msg := utils.FormatLogMessage(level, reqIDStr, method, path, statusCode, latency, clientIP)

		// Append to file
		f, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			return // Silently fail if we can't open log file
		}
		defer f.Close()

		if _, err := f.WriteString(msg); err != nil {
			return
		}

		// Also log to stdout for Render/Docker logs
		os.Stdout.WriteString(msg)
	}
}
