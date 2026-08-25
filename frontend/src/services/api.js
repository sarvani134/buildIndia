import axios from 'axios';
const api = axios.create({ baseURL:import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'), timeout:10000 });
export const searchServices = (query) => api.post('/search',{query}).then((r) => r.data);
export const getSearchSuggestions = (query) => api.get('/search/suggestions',{params:{q:query}}).then((r) => r.data.suggestions);
export const browseServices = (category='') => api.get('/services',{params:{category}}).then((r) => r.data.results);
