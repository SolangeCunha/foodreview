import axios from 'axios';

const api = axios.create({
    baseURL: "http://10.3.61.153:3000"
});

export default api;