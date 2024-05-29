package handlers

import (
	"encoding/json"
	"net/http"
	"github.com/inzarubin80/Logbook/auth/db"
	"github.com/inzarubin80/Logbook/auth/env"
	"github.com/inzarubin80/Logbook/auth/errors"
	"github.com/inzarubin80/Logbook/auth/server/write"
)

func CreateCategory(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.Category{}
	err := decoder.Decode(p)
	if err != nil || p == nil {
		return write.Error(errors.NoJSONBody)
	}


	return write.JSONorErr(env.DB().CreateCategory(r.Context(), db.CreateCategoryParams{
		Name: p.Name,
	}))
}

func GetCategory(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	category, err := env.DB().FindCategoryByIDs(r.Context(), db.FindCategoryByIDsParams{
		ID:       id,
	})
	if err != nil {
		if isNotFound(err) {
			return write.Error(errors.CategoryNotFound)
		}
		return write.Error(err)
	}

	return write.JSON(category)
}

func GetCategorys(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	return write.JSONorErr(env.DB().GetCategorys(r.Context()))
}

func UpdateCategory(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.Category{}
	err := decoder.Decode(p)
	if err != nil || p == nil {
		return write.Error(errors.NoJSONBody)
	}


	return write.JSONorErr(env.DB().UpdateCategory(r.Context(), db.UpdateCategoryParams{
		ID:       p.ID,
		Name: p.Name,
	}))
}

func DeleteCategory(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	return write.SuccessOrErr(env.DB().DeleteCategoryByIDs(r.Context(), db.DeleteCategoryByIDsParams{
		ID:       id,
	}))
}
