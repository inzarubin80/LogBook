import http from "../http-common";


export interface CategoryValuecCeateUpdate {
  id: number;
  name: string;
  category_id: number;
}

const getAll = () => {
  return http.get("/categoryValue");
};

const get = (id) => {
  return http.get(`/categoryValue/${id}`);
};


const getCategoryByName = (name) => {

  let encodedName = encodeURIComponent(name || '');
  if (encodedName === '') {
    encodedName = "*"
  }

  return http.get(`/categoryByName/${encodedName}`);
};

const createUpdate = (data:CategoryValuecCeateUpdate) => {
  if (data.id===0) {
    return http.post("/categoryValue", data);   
  } else {
    return http.put("/categoryValue", data);
  }
 
};

const remove = (id) => {
  return http.delete(`/categoryValue/${id}`);
};


export const CategoryValueService = {
  getCategoryByName,
  getAll,
  get,
  createUpdate,
  remove,
  
};

