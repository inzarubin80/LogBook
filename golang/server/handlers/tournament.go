package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/inzarubin80/Logbook/auth/db"
	"github.com/inzarubin80/Logbook/auth/env"
	"github.com/inzarubin80/Logbook/auth/errors"
	"github.com/inzarubin80/Logbook/auth/server/write"
)

func CreateTournament(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.Tournament{}
	err := decoder.Decode(p)
	if err != nil || p == nil {

		return write.Error(errors.NoJSONBody)
	}

	return write.JSONorErr(env.DB().CreateTournament(r.Context(), db.CreateTournamentParams{
		Name:                p.Name,
		BeginDateTournament: p.BeginDateTournament,
		EndDateTournament:   p.EndDateTournament,
		TypeOfTornamentID:   p.TypeOfTornamentID,
		Venue:               p.Venue,
	}))
}

func GetTournament(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	tournament, err := env.DB().FindTournamentByIDs(r.Context(), id)
	if err != nil {
		if isNotFound(err) {
			return write.Error(errors.TournamentNotFound)
		}
		return write.Error(err)
	}

	return write.JSON(tournament)
}

func GetTournaments(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	return write.JSONorErr(env.DB().GetTournaments(r.Context()))
}

func UpdateTournament(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.Tournament{}
	err := decoder.Decode(p)
	if err != nil || p == nil {
		return write.Error(errors.NoJSONBody)
	}

	return write.JSONorErr(env.DB().UpdateTournament(r.Context(), db.UpdateTournamentParams{
		ID:                  p.ID,
		Name:                p.Name,
		BeginDateTournament: p.BeginDateTournament,
		EndDateTournament:   p.EndDateTournament,
		TypeOfTornamentID:   p.TypeOfTornamentID,
		Venue:               p.Venue,
	}))
}

func DeleteTournament(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	return write.SuccessOrErr(env.DB().DeleteTournamentByIDs(r.Context(), id))
}
