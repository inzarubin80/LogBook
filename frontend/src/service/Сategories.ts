import http from "../http-common";

export interface ceateUpdateType {
  id: number;
  name: string;
}

const getAll = () => {
  return http.get("/category");
};

const get = (id:number) => {
  return http.get(`/category/${id}`);
};

const createUpdate = (data:ceateUpdateType) => {
  if (data.id===0) {
    return http.post("/category", data);   
  } else {
    return http.put("/category", data);
  }
 
};

const remove = (id:number) => {
  return http.delete(`/category/${id}`);
};


export const service = {
  getAll,
  get,
  createUpdate,
  remove,  
};

