import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

export function getEscuelas() {
    return api.get("/escuelas");
}

export default api;





