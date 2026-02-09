package services

import (
	"amar-dera/config"
	"amar-dera/internal/core/domain"
	"amar-dera/pkg/utils"
	"context"
	"errors"
)

type UserService struct {
	repo domain.UserRepository
	cfg  *config.Config
}

func NewUserService(repo domain.UserRepository, cfg *config.Config) *UserService {
	return &UserService{repo: repo, cfg: cfg}
}

func (s *UserService) Register(ctx context.Context, name, phone, password string) (*domain.User, string, error) {
	// Check if phone exists
	existing, _ := s.repo.GetByPhone(ctx, phone)
	if existing != nil {
		return nil, "", errors.New("number already exist")
	}

	// Hash password
	hashedPwd, err := utils.HashPassword(password)
	if err != nil {
		return nil, "", err
	}

	// Generate ID
	id := utils.GenerateID(name, 4)

	user := &domain.User{
		ID:           id,
		Name:         name,
		Phone:        phone,
		PasswordHash: hashedPwd,
		Messes:       []string{},
	}

	if err := s.repo.Create(ctx, user); err != nil {
		return nil, "", err
	}

	// Generate Token
	token, err := utils.GenerateJWT(user.ID, s.cfg)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func (s *UserService) Login(ctx context.Context, phone, password string) (*domain.User, string, error) {
	user, err := s.repo.GetByPhone(ctx, phone)
	if err != nil || user == nil {
		return nil, "", errors.New("invalid credentials")
	}

	if !utils.CheckPasswordHash(password, user.PasswordHash) {
		return nil, "", errors.New("invalid credentials")
	}

	token, err := utils.GenerateJWT(user.ID, s.cfg)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func (s *UserService) GetUserProfile(ctx context.Context, id string) (*domain.User, error) {
	return s.repo.GetByID(ctx, id)
}
