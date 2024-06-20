import { log } from "console";
import http from "../http-common";


export interface ScoreScaleCreateUpdate {
  id: number;
  place_from: number;
  place_to: number;
  numbers_of_points: number;
  sport_school_id: number;
  type_tournament_id: number;
}

const getAll = () => {
  return http.get("/scoreScale");
};

const get = (id) => {
  return http.get(`/scoreScale/${id}`);
};


const getSportSchoolByName = (name) => {

  let encodedName = encodeURIComponent(name || '');
  if (encodedName === '') {
    encodedName = "*"
  }
  return http.get(`/sportSchoolByName?search=${encodedName}`);
};

const getTypeTournamentByName = (name) => {

  let encodedName = encodeURIComponent(name || '');
  if (encodedName === '') {
    encodedName = "*"
  }
  return http.get(`/typeTournamentByName?search=${encodedName}`);
};

const createUpdate = (data:ScoreScaleCreateUpdate) => {
  if (data.id===0) {
    console.log(data)
    return http.post("/scoreScale", data);   
  } else {
    return http.put("/scoreScale", data);
  }
 
};

const remove = (id) => {
  return http.delete(`/scoreScale/${id}`);
};


export const ScoreScaleService = {
  getSportSchoolByName,
  getTypeTournamentByName,
  getAll,
  get,
  createUpdate,
  remove,
  
};

