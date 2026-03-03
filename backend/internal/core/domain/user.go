package domain

import "context"

type User struct {
	ID            string   `bson:"_id" json:"id"` // e.g. MAHB-X972
	Name          string   `bson:"name" json:"name"`
	Email         string   `bson:"email" json:"email"`
	Avatar        string   `bson:"avatar,omitempty" json:"avatar,omitempty"`
	GoogleID      string   `bson:"google_id,omitempty" json:"google_id,omitempty"`
	Phone         string   `bson:"phone,omitempty" json:"phone,omitempty"`
	PasswordHash  string   `bson:"password_hash,omitempty" json:"-"`
	CurrentMessID string   `bson:"current_mess_id,omitempty" json:"current_mess_id,omitempty"`
	Messes        []string `bson:"messes" json:"messes"`
	JoinRequests  []string `bson:"join_requests" json:"join_requests"`
}

type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByID(ctx context.Context, id string) (*User, error)
	GetByEmail(ctx context.Context, email string) (*User, error) // New
	GetByPhone(ctx context.Context, phone string) (*User, error)
	Update(ctx context.Context, user *User) error
}
