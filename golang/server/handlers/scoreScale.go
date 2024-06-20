package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/inzarubin80/Logbook/auth/db"
	"github.com/inzarubin80/Logbook/auth/env"
	"github.com/inzarubin80/Logbook/auth/errors"
	"github.com/inzarubin80/Logbook/auth/server/write"
)

func CreateScoreScale(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.ScoreScale{}
	err := decoder.Decode(p)
	if err != nil || p == nil {

		return write.Error(errors.NoJSONBody)
	}

	return write.JSONorErr(env.DB().CreateScoreScale(r.Context(), db.CreateScoreScaleParams{
		PlaceFrom:        p.PlaceFrom,
		PlaceTo:          p.PlaceTo,
		NumbersOfPoints:  p.NumbersOfPoints,
		SportSchoolID:    p.SportSchoolID,
		TypeTournamentID: p.TypeTournamentID,
	}))
}

func GetScoreScale(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	scoreScale, err := env.DB().FindScoreScaleByIDs(r.Context(), id)
	if err != nil {
		if isNotFound(err) {
			return write.Error(errors.ScoreScaleNotFound)
		}
		return write.Error(err)
	}

	return write.JSON(scoreScale)
}

func GetScoreScales(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	return write.JSONorErr(env.DB().GetScoreScales(r.Context()))
}

func UpdateScoreScale(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	decoder := json.NewDecoder(r.Body)
	p := &db.ScoreScale{}
	err := decoder.Decode(p)
	if err != nil || p == nil {
		return write.Error(errors.NoJSONBody)
	}

	return write.JSONorErr(env.DB().UpdateScoreScale(r.Context(), db.UpdateScoreScaleParams{
		ID:               p.ID,
		PlaceFrom:        p.PlaceFrom,
		PlaceTo:          p.PlaceTo,
		NumbersOfPoints:  p.NumbersOfPoints,
		SportSchoolID:    p.SportSchoolID,
		TypeTournamentID: p.TypeTournamentID,
	}))
}

func DeleteScoreScale(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc {
	if user.Status != db.UserStatusActive {
		return write.Error(errors.RouteUnauthorized)
	}

	id, err := getID(r)
	if err != nil {
		return write.Error(errors.RouteNotFound)
	}

	return write.SuccessOrErr(env.DB().DeleteScoreScaleByIDs(r.Context(), id))
}
