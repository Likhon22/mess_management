package mongo

import (
	"amar-dera/internal/core/domain"
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type MessRepository struct {
	collection *mongo.Collection
}

func NewMessRepository(db *mongo.Database) domain.MessRepository {
	return &MessRepository{
		collection: db.Collection("messes"),
	}
}

func (r *MessRepository) Create(ctx context.Context, mess *domain.Mess) error {
	_, err := r.collection.InsertOne(ctx, mess)
	return err
}

func (r *MessRepository) GetByID(ctx context.Context, id string) (*domain.Mess, error) {
	var mess domain.Mess
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&mess)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &mess, nil
}

func (r *MessRepository) Update(ctx context.Context, mess *domain.Mess) error {
	filter := bson.M{"_id": mess.ID}
	update := bson.M{"$set": mess}
	_, err := r.collection.UpdateOne(ctx, filter, update)
	return err
}

func (r *MessRepository) AddMember(ctx context.Context, messID string, member domain.Member) error {
	filter := bson.M{"_id": messID}
	update := bson.M{"$push": bson.M{"members": member}}
	_, err := r.collection.UpdateOne(ctx, filter, update)
	return err
}
