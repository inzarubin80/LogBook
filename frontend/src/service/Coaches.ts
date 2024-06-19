import http from "../http-common";

export interface ceateUpdateType {
  id: number;
  name: string;
}

const getAll = () => {
  return http.get("/coache");
};

const get = (id:number) => {
  return http.get(`/coache/${id}`);
};

const createUpdate = (data:ceateUpdateType) => {
  if (data.id===0) {
    return http.post("/coache", data);   
  } else {
    return http.put("/coache", data);
  }
 
};

const remove = (id:number) => {
  return http.delete(`/coache/${id}`);
};


export const service = {
  getAll,
  get,
  createUpdate,
  remove,  
};

