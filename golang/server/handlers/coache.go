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

func CreateCoache(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.Coache{}
	err := decoder.Decode(p)
	if err != nil || p == nil {
		return write.Error(errors.NoJSONBody)
	}

	return write.JSONorErr(env.DB().CreateCoache(r.Context(), p.Name))
}

func GetCoache(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	coache, err := env.DB().FindCoacheByIDs(r.Context(), id)
	if err != nil {
		if isNotFound(err) {
			return write.Error(errors.CoacheNotFound)
		}
		return write.Error(err)
	}

	return write.JSON(coache)
}

func GetCoaches(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	return write.JSONorErr(env.DB().GetCoaches(r.Context(), "%%*%%"))
}

func GetCoachesByName(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}
	search := getStringQuery("search", r)
	search = "%%" + search + "%%"
	return write.JSONorErr(env.DB().GetCoaches(r.Context(), search))
}

func UpdateCoache(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.Coache{}
	err := decoder.Decode(p)
	if err != nil || p == nil {
		return write.Error(errors.NoJSONBody)
	}

	log.Println("p.ID", p.ID)
	log.Println("p.Name", p.Name)

	return write.JSONorErr(env.DB().UpdateCoache(r.Context(), db.UpdateCoacheParams{
		Name: p.Name,
		ID:   p.ID,
	}))
}

func DeleteCoache(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	return write.SuccessOrErr(env.DB().DeleteCoacheByIDs(r.Context(), id))
}
