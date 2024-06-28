package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/inzarubin80/Logbook/auth/db"
	"github.com/inzarubin80/Logbook/auth/env"
	"github.com/inzarubin80/Logbook/auth/errors"
	"github.com/inzarubin80/Logbook/auth/server/write"
)

func CreateSportsman(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.Sportsman{}
	err := decoder.Decode(p)
	if err != nil || p == nil {

		return write.Error(errors.NoJSONBody)
	}

	return write.JSONorErr(env.DB().CreateSportsman(r.Context(), db.CreateSportsmanParams{
		Name:          p.Name,
		Gender:        p.Gender,
		DateBirth:     p.DateBirth,
		MainCoacheID:  p.MainCoacheID,
		SportSchoolID: p.SportSchoolID,
		Insuranse:     p.Insuranse,
	}))
}

func GetSportsman(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	sportsman, err := env.DB().FindSportsmanByIDs(r.Context(), id)
	if err != nil {
		if isNotFound(err) {
			return write.Error(errors.SportsmanNotFound)
		}
		return write.Error(err)
	}

	return write.JSON(sportsman)
}

func GetSportsmans(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	return write.JSONorErr(env.DB().GetSportsmans(r.Context()))
}

func UpdateSportsman(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.Sportsman{}
	err := decoder.Decode(p)
	if err != nil || p == nil {
		return write.Error(errors.NoJSONBody)
	}

	return write.JSONorErr(env.DB().UpdateSportsman(r.Context(), db.UpdateSportsmanParams{
		ID:            p.ID,
		Name:          p.Name,
		Gender:        p.Gender,
		DateBirth:     p.DateBirth,
		MainCoacheID:  p.MainCoacheID,
		SportSchoolID: p.SportSchoolID,
		Insuranse:     p.Insuranse,
	}))
}

func DeleteSportsman(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	return write.SuccessOrErr(env.DB().DeleteSportsmanByIDs(r.Context(), id))
}
