package mongo

import (
	"amar-dera/internal/core/domain"
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type FinanceRepository struct {
	db *mongo.Database
}

func NewFinanceRepository(db *mongo.Database) domain.FinanceRepository {
	return &FinanceRepository{
		db: db,
	}
}

// --- Service Costs ---
func (r *FinanceRepository) AddServiceCost(ctx context.Context, cost *domain.ServiceCost) error {
	_, err := r.db.Collection("service_costs").InsertOne(ctx, cost)
	return err
}

func (r *FinanceRepository) GetServiceCosts(ctx context.Context, messID, month string) ([]domain.ServiceCost, error) {
	filter := bson.M{"mess_id": messID, "month": month}
	cursor, err := r.db.Collection("service_costs").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	var costs []domain.ServiceCost
	if err = cursor.All(ctx, &costs); err != nil {
		return nil, err
	}
	return costs, nil
}

func (r *FinanceRepository) DeleteServiceCost(ctx context.Context, costID string) error {
	_, err := r.db.Collection("service_costs").DeleteOne(ctx, bson.M{"_id": costID})
	return err
}

// --- Payments ---
func (r *FinanceRepository) CreatePayment(ctx context.Context, payment *domain.Payment) error {
	_, err := r.db.Collection("payments").InsertOne(ctx, payment)
	return err
}

func (r *FinanceRepository) GetPaymentByID(ctx context.Context, paymentID string) (*domain.Payment, error) {
	var payment domain.Payment
	err := r.db.Collection("payments").FindOne(ctx, bson.M{"_id": paymentID}).Decode(&payment)
	if err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r *FinanceRepository) GetPayments(ctx context.Context, messID, month string) ([]domain.Payment, error) {
	filter := bson.M{"mess_id": messID, "month": month}
	cursor, err := r.db.Collection("payments").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	var payments []domain.Payment
	if err = cursor.All(ctx, &payments); err != nil {
		return nil, err
	}
	return payments, nil
}

func (r *FinanceRepository) GetMemberPayments(ctx context.Context, messID, userID string) ([]domain.Payment, error) {
	filter := bson.M{"mess_id": messID, "user_id": userID}
	// Sort by date descending (newest first)
	opts := options.Find().SetSort(bson.M{"created_at": -1})
	cursor, err := r.db.Collection("payments").Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	var payments []domain.Payment
	if err = cursor.All(ctx, &payments); err != nil {
		return nil, err
	}
	return payments, nil
}

func (r *FinanceRepository) UpdatePaymentStatus(ctx context.Context, paymentID, status, approverID string) error {
	filter := bson.M{"_id": paymentID}
	update := bson.M{"$set": bson.M{"status": status, "approved_by": approverID}}
	_, err := r.db.Collection("payments").UpdateOne(ctx, filter, update)
	return err
}

// --- Bazar ---
func (r *FinanceRepository) CreateBazar(ctx context.Context, bazar *domain.Bazar) error {
	_, err := r.db.Collection("bazars").InsertOne(ctx, bazar)
	return err
}

func (r *FinanceRepository) GetBazarByID(ctx context.Context, bazarID string) (*domain.Bazar, error) {
	var bazar domain.Bazar
	err := r.db.Collection("bazars").FindOne(ctx, bson.M{"_id": bazarID}).Decode(&bazar)
	if err != nil {
		return nil, err
	}
	return &bazar, nil
}

func (r *FinanceRepository) GetBazars(ctx context.Context, messID, month string) ([]domain.Bazar, error) {
	filter := bson.M{"mess_id": messID, "month": month}
	cursor, err := r.db.Collection("bazars").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	var bazars []domain.Bazar
	if err = cursor.All(ctx, &bazars); err != nil {
		return nil, err
	}
	return bazars, nil
}

func (r *FinanceRepository) ApproveBazar(ctx context.Context, bazarID string) error {
	filter := bson.M{"_id": bazarID}
	update := bson.M{"$set": bson.M{"status": "approved"}}
	_, err := r.db.Collection("bazars").UpdateOne(ctx, filter, update)
	return err
}

// --- Daily Meals ---
func (r *FinanceRepository) UpsertDailyMeal(ctx context.Context, meal *domain.DailyMeal) error {
	filter := bson.M{"date": meal.Date, "user_id": meal.UserID, "mess_id": meal.MessID}

	// Create a map for setting fields, but EXCLUDE _id to prevent immutable field errors
	update := bson.M{
		"$set": bson.M{
			"date":        meal.Date,
			"user_id":     meal.UserID,
			"mess_id":     meal.MessID,
			"breakfast":   meal.Breakfast,
			"lunch":       meal.Lunch,
			"dinner":      meal.Dinner,
			"guest_meals": meal.GuestMeals,
			"month":       meal.Month,
		},
	}

	opts := options.Update().SetUpsert(true)
	_, err := r.db.Collection("daily_meals").UpdateOne(ctx, filter, update, opts)
	return err
}

func (r *FinanceRepository) GetDailyMeals(ctx context.Context, messID, month string) ([]domain.DailyMeal, error) {
	filter := bson.M{"mess_id": messID, "month": month}
	cursor, err := r.db.Collection("daily_meals").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	var meals []domain.DailyMeal
	if err = cursor.All(ctx, &meals); err != nil {
		return nil, err
	}
	return meals, nil
}

// --- Month Lock ---
func (r *FinanceRepository) GetMonthLock(ctx context.Context, messID, month string) (*domain.MonthLock, error) {
	var lock domain.MonthLock
	filter := bson.M{"mess_id": messID, "month": month}
	err := r.db.Collection("month_locks").FindOne(ctx, filter).Decode(&lock)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &lock, nil
}

func (r *FinanceRepository) UpsertMonthLock(ctx context.Context, lock *domain.MonthLock) error {
	filter := bson.M{"mess_id": lock.MessID, "month": lock.Month}
	update := bson.M{"$set": lock}
	opts := options.Update().SetUpsert(true)
	_, err := r.db.Collection("month_locks").UpdateOne(ctx, filter, update, opts)
	return err
}

func (r *FinanceRepository) UpdateBazar(ctx context.Context, bazar *domain.Bazar) error {
	filter := bson.M{"_id": bazar.ID}
	update := bson.M{"$set": bson.M{
		"amount":   bazar.Amount,
		"items":    bazar.Items,
		"status":   bazar.Status,
		"buyer_id": bazar.BuyerID,
		"date":     bazar.Date,
	}}
	_, err := r.db.Collection("bazars").UpdateOne(ctx, filter, update)
	return err
}

func (r *FinanceRepository) DeleteBazar(ctx context.Context, bazarID string) error {
	filter := bson.M{"_id": bazarID}
	_, err := r.db.Collection("bazars").DeleteOne(ctx, filter)
	return err
}
