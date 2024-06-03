// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package db

import (
	"context"
)

type Querier interface {
	CreateCategory(ctx context.Context, name string) (Category, error)
	CreateReset(ctx context.Context, arg CreateResetParams) (Reset, error)
	CreateSportSchool(ctx context.Context, name string) (SportSchool, error)
	CreateUser(ctx context.Context, arg CreateUserParams) (User, error)
	DeleteCategoryByIDs(ctx context.Context, id int64) error
	DeleteResetsForUser(ctx context.Context, userID int64) error
	DeleteSportSchoolByIDs(ctx context.Context, id int64) error
	FindCategoryByIDs(ctx context.Context, id int64) (Category, error)
	FindResetByCode(ctx context.Context, code string) (Reset, error)
	FindSportSchoolByIDs(ctx context.Context, id int64) (SportSchool, error)
	FindUserByEmail(ctx context.Context, lower string) (User, error)
	FindUserByID(ctx context.Context, id int64) (User, error)
	FindUserByVerificationCode(ctx context.Context, verification string) (User, error)
	GetCategorys(ctx context.Context) ([]Category, error)
	GetSportSchools(ctx context.Context) ([]SportSchool, error)
	UpdateCategory(ctx context.Context, arg UpdateCategoryParams) (Category, error)
	UpdateSportSchool(ctx context.Context, arg UpdateSportSchoolParams) (SportSchool, error)
	UpdateUserPassword(ctx context.Context, arg UpdateUserPasswordParams) error
	UpdateUserStatus(ctx context.Context, arg UpdateUserStatusParams) error
}

var _ Querier = (*Queries)(nil)
