package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// GetLogFilePath returns the path to the daily log file, organized by month
// e.g., logs/February/01.log
func GetLogFilePath() string {
	now := time.Now()
	monthFolder := now.Format("January")
	dayFile := now.Format("02") + ".log"

	return filepath.Join("logs", monthFolder, dayFile)
}

// GetLogLevel determines the log level based on the HTTP status code
func GetLogLevel(statusCode int) string {
	if statusCode >= 500 {
		return "ERROR"
	}
	if statusCode >= 400 {
		return "WARN"
	}
	return "INFO"
}

// EnsureLogDir creates the monthly log directory if it doesn't exist
func EnsureLogDir(path string) error {
	dir := filepath.Dir(path)
	return os.MkdirAll(dir, 0755)
}

// FormatLogMessage creates a standardized log line
func FormatLogMessage(level, requestID, method, path string, statusCode int, latency time.Duration, clientIP string) string {
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	return fmt.Sprintf("[%s] %s | %s | %d | %s | %s | %s | %s\n",
		timestamp, level, requestID, statusCode, latency, clientIP, method, path)
}
