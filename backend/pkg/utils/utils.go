package utils

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

// GenerateID creates an ID like MAHB-X972
func GenerateID(prefix string, length int) string {
	if len(prefix) > 4 {
		prefix = prefix[:4]
	}
	prefix = strings.ToUpper(prefix)

	bytes := make([]byte, length/2+1)
	if _, err := rand.Read(bytes); err != nil {
		return prefix + "-ERROR"
	}
	suffix := hex.EncodeToString(bytes)
	suffix = strings.ToUpper(suffix[:length])

	return fmt.Sprintf("%s-%s", prefix, suffix)
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func ValidatePhone(phone string) error {
	if len(phone) != 11 {
		return fmt.Errorf("phone number must be exactly 11 digits")
	}
	if !strings.HasPrefix(phone, "01") {
		return fmt.Errorf("phone number must start with 01")
	}
	for _, char := range phone {
		if char < '0' || char > '9' {
			return fmt.Errorf("phone number must contain only digits")
		}
	}
	return nil
}
