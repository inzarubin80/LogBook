import http from "../http-common";

export interface ceateUpdateType {
  id: number;
  name: string;
}

const getAll = () => {
  return http.get("/sportSchool");
};

const get = (id:number) => {
  return http.get(`/sportSchool/${id}`);
};

const createUpdate = (data:ceateUpdateType) => {
  if (data.id===0) {
    return http.post("/sportSchool", data);   
  } else {
    return http.put("/sportSchool", data);
  }
 
};

const remove = (id:number) => {
  return http.delete(`/sportSchool/${id}`);
};


export const service = {
  getAll,
  get,
  createUpdate,
  remove,  
};

