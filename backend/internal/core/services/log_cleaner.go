package services

import (
	"log"
	"os"
	"path/filepath"
	"time"
)

// StartLogCleaner starts a background goroutine to clean up logs
func StartLogCleaner() {
	go func() {
		for {
			now := time.Now()

			// On the 10th of every month, clean up the previous month
			if now.Day() == 10 {
				lastMonth := now.AddDate(0, -1, 0).Format("January")
				logDir := filepath.Join("logs", lastMonth)

				if _, err := os.Stat(logDir); err == nil {
					log.Printf("Cleaning up logs for %s...", lastMonth)
					if err := os.RemoveAll(logDir); err != nil {
						log.Printf("Failed to cleanup logs: %v", err)
					} else {
						log.Printf("Successfully cleaned up logs for %s", lastMonth)
					}
				}
			}

			// Sleep for 24 hours before checking again
			time.Sleep(24 * time.Hour)
		}
	}()
}
