package handlers

import (
	"amar-dera/internal/core/domain"
	"amar-dera/internal/core/services"
	"amar-dera/pkg/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MessHandler struct {
	service *services.MessService
}

func NewMessHandler(service *services.MessService) *MessHandler {
	return &MessHandler{service: service}
}

func (h *MessHandler) CreateMess(c *gin.Context) {
	var req struct {
		Name string `json:"name" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "invalid request", err)
		return
	}

	userID := c.GetString("userID")
	mess, err := h.service.CreateMess(c.Request.Context(), req.Name, userID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "failed to create mess", err)
		return
	}

	utils.SendSuccess(c, http.StatusCreated, "mess created", mess)
}

func (h *MessHandler) JoinMess(c *gin.Context) {
	var req struct {
		MessID string `json:"mess_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Printf("[DEBUG] JoinMess: binding failed: %v\n", err)
		utils.SendError(c, http.StatusBadRequest, "invalid request", err)
		return
	}

	userID := c.GetString("userID")
	fmt.Printf("[DEBUG] JoinMess: userID=%s, mess_id=%s\n", userID, req.MessID)
	err := h.service.RequestJoin(c.Request.Context(), req.MessID, userID)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "join request failed", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "join request sent", nil)
}

func (h *MessHandler) ApproveMember(c *gin.Context) {
	// messID from param, memberID from body
	messID := c.Param("id")
	var req struct {
		UserID string `json:"user_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Missing user_id in request", err)
		return
	}

	userID := c.GetString("userID")
	err := h.service.ApproveMember(c.Request.Context(), messID, req.UserID, userID)
	if err != nil {
		utils.SendError(c, http.StatusForbidden, "approval failed", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "member approved", nil)
}

func (h *MessHandler) GetRequests(c *gin.Context) {
	messID := c.Param("id")
	userID := c.GetString("userID")

	requests, err := h.service.GetRequests(c.Request.Context(), messID, userID)
	if err != nil {
		utils.SendError(c, http.StatusForbidden, "failed to fetch requests", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "pending requests", requests)
}

func (h *MessHandler) AssignRole(c *gin.Context) {
	messID := c.Param("id")
	var req struct {
		TargetUserID string `json:"user_id" binding:"required"`
		Role         string `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "invalid request", err)
		return
	}

	userID := c.GetString("userID")
	// Role validation could be here or service
	// For simplicity passing string to service and let it handle domain.Role conversion if we move role def to sharing
	// But service expects domain.Role.
	// Importing domain is needed in handler? Ideally NO.
	// But for MVP let's assume valid string matches domain constant
	err := h.service.AssignRole(c.Request.Context(), messID, req.TargetUserID, userID, domain.Role(req.Role))
	if err != nil {
		utils.SendError(c, http.StatusForbidden, "failed to assign role", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "role assigned", nil)
}

func (h *MessHandler) RemoveRole(c *gin.Context) {
	messID := c.Param("id")
	var req struct {
		TargetUserID string `json:"user_id" binding:"required"`
		Role         string `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "invalid request", err)
		return
	}

	userID := c.GetString("userID")
	err := h.service.RemoveRole(c.Request.Context(), messID, req.TargetUserID, userID, domain.Role(req.Role))
	if err != nil {
		utils.SendError(c, http.StatusForbidden, "failed to remove role", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "role removed", nil)
}

func (h *MessHandler) GetMessDetails(c *gin.Context) {
	messID := c.Param("id")
	mess, err := h.service.GetMessDetails(c.Request.Context(), messID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "failed to get mess details", err)
		return
	}
	if mess == nil {
		utils.SendError(c, http.StatusNotFound, "mess not found", nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "mess details", mess)
}
