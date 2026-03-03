package handlers

import (
	"amar-dera/internal/core/services"
	"amar-dera/pkg/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service *services.UserService
}

func NewAuthHandler(service *services.UserService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (h *AuthHandler) GoogleLogin(c *gin.Context) {
	var req struct {
		IDToken string `json:"credential" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "google credential is required", err)
		return
	}

	user, token, err := h.service.LoginWithGoogle(c.Request.Context(), req.IDToken)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "google login failed", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "login successful", gin.H{
		"user":  user,
		"token": token,
	})
}

func (h *AuthHandler) Me(c *gin.Context) {
	userID := c.GetString("userID") // From middleware
	if userID == "" {
		utils.SendError(c, http.StatusUnauthorized, "unauthorized", nil)
		return
	}

	user, err := h.service.GetUserProfile(c.Request.Context(), userID)
	if err != nil {
		utils.SendError(c, http.StatusNotFound, "user not found", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "user profile", user)
}
