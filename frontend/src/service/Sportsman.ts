import { log } from "console";
import http from "../http-common";
import dayjs, { Dayjs } from 'dayjs';


export interface ceateUpdateType {
 
  id: number;
  name: string;
  gender: string;
  date_birth: Dayjs;
  main_coache_id: number;
  sport_school_id: number;
  insuranse: string;
}

const getAll = () => {
  return http.get("/sportsman");
};

const get = (id) => {
  return http.get(`/sportsman/${id}`);
};


const getSportSchoolByName = (name) => {

  let encodedName = encodeURIComponent(name || '');
  if (encodedName === '') {
    encodedName = "*"
  }
  return http.get(`/sportSchoolByName?search=${encodedName}`);
};

const getCoacheByName = (name) => {

  let encodedName = encodeURIComponent(name || '');
  if (encodedName === '') {
    encodedName = "*"
  }
  return http.get(`/coacheByName?search=${encodedName}`);
};

const createUpdate = (data:ceateUpdateType) => {
  if (data.id===0) {
    console.log(data)
    return http.post("/sportsman", data);   
  } else {
    return http.put("/sportsman", data);
  }
 
};

const remove = (id) => {
  return http.delete(`/sportsman/${id}`);
};


export const service = {
  getSportSchoolByName,
  getCoacheByName,
  getAll,
  get,
  createUpdate,
  remove,
  
};

