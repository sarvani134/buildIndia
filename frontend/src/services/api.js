import axios from 'axios';
const api = axios.create({ baseURL:import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout:10000 });
export const searchServices = (query) => api.post('/search',{query}).then((r) => r.data);
export const browseServices = (category='') => api.get('/services',{params:{category}}).then((r) => r.data.results);

