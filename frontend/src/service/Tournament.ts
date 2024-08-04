import { log } from "console";
import http from "../http-common";


export interface createUpdateType {
 
  id: number;
  name: string;
  begin_date_tournament: Date;
  end_date_tournament: Date;
  type_of_tornament_id: number;
  venue: string;
}

const getAll = () => {
  return http.get("/tournament");
};

const get = (id) => {
  return http.get(`/tournament/${id}`);
};


const getTypeTournamentByName = (name) => {

  let encodedName = encodeURIComponent(name || '');
  if (encodedName === '') {
    encodedName = "*"
  }
  return http.get(`/typeTournamentByName?search=${encodedName}`);
};

const getCoacheByName = (name) => {

  let encodedName = encodeURIComponent(name || '');
  if (encodedName === '') {
    encodedName = "*"
  }
  return http.get(`/coacheByName?search=${encodedName}`);
};

const createUpdate = (data:createUpdateType) => {
  if (data.id===0) {
    console.log(data)
    return http.post("/tournament", data);   
  } else {
    return http.put("/tournament", data);
  }
 
};

const remove = (id) => {
  return http.delete(`/tournament/${id}`);
};


export const service = {
  getTypeTournamentByName,
  getCoacheByName,
  getAll,
  get,
  createUpdate,
  remove,
  
};

