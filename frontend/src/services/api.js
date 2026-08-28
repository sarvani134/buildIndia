import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  // A free Render service can take longer than ten seconds to wake from sleep.
  timeout: 60000
});

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

api.interceptors.response.use(undefined, async (error) => {
  const config = error.config;
  const status = error.response?.status;
  const temporaryStartupFailure =
    error.code === 'ECONNABORTED' ||
    error.code === 'ERR_NETWORK' ||
    [502, 503, 504].includes(status);

  if (!config || config._startupRetry || !temporaryStartupFailure) {
    return Promise.reject(error);
  }

  config._startupRetry = true;
  await wait(1500);
  return api.request(config);
});

export const searchServices = (query) => api.post('/search',{query}).then((r) => r.data);
export const getSearchSuggestions = (query) => api.get('/search/suggestions',{params:{q:query}}).then((r) => r.data.suggestions);
export const browseServices = (category='') => api.get('/services',{params:{category}}).then((r) => r.data.results);
