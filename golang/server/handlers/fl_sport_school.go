package handlers

import (
	"log"
	"encoding/json"
	"net/http"
	"github.com/inzarubin80/Logbook/auth/db"
	"github.com/inzarubin80/Logbook/auth/env"
	"github.com/inzarubin80/Logbook/auth/errors"
	"github.com/inzarubin80/Logbook/auth/server/write"
)

func CreateFl_sport_school(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.Fl_sport_school{}
	err := decoder.Decode(p)
	if err != nil || p == nil {
		return write.Error(errors.NoJSONBody)
	}


	return write.JSONorErr(env.DB().CreateFl_sport_school(r.Context(), p.Name))
}

func GetFl_sport_school(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	fl_sport_school, err := env.DB().FindFl_sport_schoolByIDs(r.Context(), id)
	if err != nil {
		if isNotFound(err) {
			return write.Error(errors.Fl_sport_schoolNotFound)
		}
		return write.Error(err)
	}

	return write.JSON(fl_sport_school)
}

func GetFl_sport_school(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	return write.JSONorErr(env.DB().GetFl_sport_schools(r.Context()))
}

func UpdateFl_sport_school(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.Fl_sport_school{}
	err := decoder.Decode(p)
	if err != nil || p == nil {
		return write.Error(errors.NoJSONBody)
	}

	log.Println("p.ID", p.ID)
	log.Println("p.Name", p.Name)
	
	return write.JSONorErr(env.DB().UpdateFl_sport_school(r.Context(), db.UpdateFl_sport_schoolParams{
		Name: p.Name,
		ID:       p.ID,
	}))
}

func DeleteFl_sport_school(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	return write.SuccessOrErr(env.DB().DeleteFl_sport_schoolByIDs(r.Context(), id))
}
