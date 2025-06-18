import axios from 'axios';


// Create a new instance of axios with some default settings
const http = axios.create({
    baseURL: '/api',
    timeout: 1000 * 100,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

http.interceptors.request.use(config => {
        const proxy = import.meta.env.VITE_API_PROXY;
        if (config.method === 'get' || config.method === 'GET') {
            config.params = config.params || {};
            config.params.proxy = proxy;
        } else {
            if (config.data && typeof config.data === 'object') {
                config.data.proxy = proxy;
            } else {
                config.data = {proxy: proxy};
            }
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error)
    }
)

http.interceptors.response.use(response => {
        const data = response.data;
        return data;
    }, error => {
        return Promise.reject(error);
    }
)

export default http;