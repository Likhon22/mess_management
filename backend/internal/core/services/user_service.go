package services

import (
	"amar-dera/config"
	"amar-dera/internal/core/domain"
	"amar-dera/pkg/utils"
	"context"
	"errors"

	"google.golang.org/api/idtoken"
)

type UserService struct {
	repo domain.UserRepository
	cfg  *config.Config
}

func NewUserService(repo domain.UserRepository, cfg *config.Config) *UserService {
	return &UserService{repo: repo, cfg: cfg}
}

func (s *UserService) LoginWithGoogle(ctx context.Context, idToken string) (*domain.User, string, error) {
	// Verify Google ID Token
	payload, err := idtoken.Validate(ctx, idToken, s.cfg.GoogleClientID)
	if err != nil {
		return nil, "", err
	}

	email, ok := payload.Claims["email"].(string)
	if !ok || email == "" {
		return nil, "", errors.New("email not found in token")
	}

	name, _ := payload.Claims["name"].(string)
	avatar, _ := payload.Claims["picture"].(string)
	googleID := payload.Subject

	// Check if user exists by email
	user, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return nil, "", err
	}

	if user == nil {
		// Create new user
		id := utils.GenerateID(name, 4)
		user = &domain.User{
			ID:       id,
			Name:     name,
			Email:    email,
			Avatar:   avatar,
			GoogleID: googleID,
			Messes:   []string{},
		}
		if err := s.repo.Create(ctx, user); err != nil {
			return nil, "", err
		}
	} else {
		// Update existing user info
		updated := false
		if user.GoogleID == "" {
			user.GoogleID = googleID
			updated = true
		}
		if user.Avatar != avatar {
			user.Avatar = avatar
			updated = true
		}
		if updated {
			_ = s.repo.Update(ctx, user)
		}
	}

	// Generate Session Token (JWT)
	token, err := utils.GenerateJWT(user.ID, s.cfg)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func (s *UserService) GetUserProfile(ctx context.Context, id string) (*domain.User, error) {
	return s.repo.GetByID(ctx, id)
}
