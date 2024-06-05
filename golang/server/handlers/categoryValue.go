package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/inzarubin80/Logbook/auth/db"
	"github.com/inzarubin80/Logbook/auth/env"
	"github.com/inzarubin80/Logbook/auth/errors"
	"github.com/inzarubin80/Logbook/auth/server/write"
)

func CreateCategoryValue(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.CategoryValue{}
	err := decoder.Decode(p)
	if err != nil || p == nil {
		return write.Error(errors.NoJSONBody)
	}
	
	return write.JSONorErr(env.DB().CreateCategoryValue(r.Context(), db.CreateCategoryValueParams{
		Name:p.Name,
		CategoryID:p.CategoryID,	
	}))
}

func GetCategoryValue(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	categoryValue, err := env.DB().FindCategoryValueByIDs(r.Context(), id)
	if err != nil {
		if isNotFound(err) {
			return write.Error(errors.CategoryValueNotFound)
		}
		return write.Error(err)
	}

	return write.JSON(categoryValue)
}

func GetCategoryValues(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	return write.JSONorErr(env.DB().GetCategoryValues(r.Context()))
}

func UpdateCategoryValue(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.CategoryValue{}
	err := decoder.Decode(p)
	if err != nil || p == nil {
		return write.Error(errors.NoJSONBody)
	}

	log.Println("p.ID", p.ID)
	log.Println("p.Name", p.Name)
	log.Println("p.CategoryID", p.CategoryID)

	return write.JSONorErr(env.DB().UpdateCategoryValue(r.Context(), db.UpdateCategoryValueParams{
		Name: p.Name,
		ID:   p.ID,
	}))
}

func DeleteCategoryValue(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	return write.SuccessOrErr(env.DB().DeleteCategoryValueByIDs(r.Context(), id))
}
