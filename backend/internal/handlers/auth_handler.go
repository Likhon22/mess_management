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

func (h *AuthHandler) Signup(c *gin.Context) {
	var req struct {
		Name     string `json:"name" binding:"required"`
		Phone    string `json:"phone" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "invalid request", err)
		return
	}

	user, token, err := h.service.Register(c.Request.Context(), req.Name, req.Phone, req.Password)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "number already exist" {
			status = http.StatusConflict
		}
		utils.SendError(c, status, err.Error(), err)
		return
	}

	utils.SendSuccess(c, http.StatusCreated, "user registered", gin.H{
		"user":  user,
		"token": token,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req struct {
		Phone    string `json:"phone" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "invalid request", err)
		return
	}

	user, token, err := h.service.Login(c.Request.Context(), req.Phone, req.Password)
	if err != nil {
		utils.SendError(c, http.StatusUnauthorized, "login failed", err)
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
