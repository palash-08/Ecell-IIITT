import axios from 'axios';

const getBaseURL = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    // Ensure URL ends with /api if it's a production URL
    if (url.includes('onrender.com') && !url.endsWith('/api')) {
        return `${url}/api`;
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// For multipart/form-data (image uploads)
export const apiMulti = axios.create({
    baseURL: getBaseURL(),
});

// Add interceptor to include token
const addAuthToken = (config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
};

api.interceptors.request.use(addAuthToken);
apiMulti.interceptors.request.use(addAuthToken);

export default api;
