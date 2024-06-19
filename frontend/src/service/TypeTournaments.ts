import http from "../http-common";

export interface ceateUpdateType {
  id: number;
  name: string;
}

const getAll = () => {
  return http.get("/typeTournament");
};

const get = (id:number) => {
  return http.get(`/typeTournament/${id}`);
};

const createUpdate = (data:ceateUpdateType) => {
  if (data.id===0) {
    return http.post("/typeTournament", data);   
  } else {
    return http.put("/typeTournament", data);
  }
 
};

const remove = (id:number) => {
  return http.delete(`/typeTournament/${id}`);
};


export const service = {
  getAll,
  get,
  createUpdate,
  remove,  
};

