package domain

import (
	"context"
	"time"
)

type Role string

const (
	RoleAdmin   Role = "admin"
	RoleManager Role = "manager"
	RoleMember  Role = "member"
)

type Mess struct {
	ID        string    `bson:"_id" json:"id"` // e.g. SKYV-88A1
	Name      string    `bson:"name" json:"name"`
	AdminID   string    `bson:"admin_id" json:"admin_id"`
	Members   []Member  `bson:"members" json:"members"`
	CreatedAt time.Time `bson:"created_at" json:"created_at"`
}

type Member struct {
	UserID   string    `bson:"user_id" json:"user_id"`
	Name     string    `bson:"name,omitempty" json:"name,omitempty"`
	Roles    []Role    `bson:"roles" json:"roles"`
	JoinedAt time.Time `bson:"joined_at" json:"joined_at"`
	Status   string    `bson:"status" json:"status"` // active, pending, left
}

type MessRepository interface {
	Create(ctx context.Context, mess *Mess) error
	GetByID(ctx context.Context, id string) (*Mess, error)
	Update(ctx context.Context, mess *Mess) error
	AddMember(ctx context.Context, messID string, member Member) error
	// More methods as needed
}
