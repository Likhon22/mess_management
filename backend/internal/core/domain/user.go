package domain

import "context"

type User struct {
	ID            string   `bson:"_id" json:"id"` // e.g. MAHB-X972
	Name          string   `bson:"name" json:"name"`
	Phone         string   `bson:"phone" json:"phone"`
	PasswordHash  string   `bson:"password_hash" json:"-"`
	CurrentMessID string   `bson:"current_mess_id,omitempty" json:"current_mess_id,omitempty"`
	Messes        []string `bson:"messes" json:"messes"`
	JoinRequests  []string `bson:"join_requests" json:"join_requests"`
}

type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByID(ctx context.Context, id string) (*User, error)
	GetByPhone(ctx context.Context, phone string) (*User, error)
	Update(ctx context.Context, user *User) error
}
