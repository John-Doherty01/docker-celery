import axios, {AxiosResponse} from "axios";

export const CLIENT_ID = "FSb5TMUaS4GSdaFjj1M8kfwec2vxe7EH3eO8pdcx";
export const CLIENT_SECRET = "0KobqEc4etm10YU3IeEdJ9k0Pv6GTuUl8UO15WnrlkkIgJ9MgVZqzCApFTWSaURudxlDj3gIUJcwkPXcORV1i1kcGrEXDXF2rxNMWtm4Hr6iuNDncp3c5g7P5BMY8mo7";
export const HOST_URL = "http://localhost:8000/";
const TOKEN_LOCALSTORAGE_KEY = "TOKEN";
let refreshing = false;
export const axiosAuthInstance = axios.create();

axiosAuthInstance.interceptors.request.use((config) => {
    const local = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
    if (local === null) return config;
    const token = JSON.parse(local).access_token;
    if (token && config.headers !== undefined) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})
axiosAuthInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await refreshToken();
        return axiosAuthInstance(originalRequest);
    }
    return Promise.reject(error);
})

export function login(username: string, password: string) {
    const url = HOST_URL + 'o/token/';

    const request = axios.post(url, new URLSearchParams({
        username: username,
        password: password,
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
        request.then((res) => {
            const token = JSON.stringify(res.data);
            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, token);
            resolve(res);
        }).catch((err)=>{
            reject(err);
        });
    });
}

function refreshToken() {
    const local = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
        if (local === null || refreshing) {
            reject('already refreshing or localstorage token not found');
            return;
        }
        const token = JSON.parse(local);
        const url = HOST_URL + 'o/token/';
        refreshing = true;
        const request = axios.post(url, new URLSearchParams({
            refresh_token: token.refresh_token,
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        request.then((res) => {
            const token = JSON.stringify(res.data);
            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, token);
            refreshing = false;
            resolve(res);
        }).catch((err) => {
            refreshing = false;
            reject(err);
            // ToDo: Redirect to login
        });
    });
}
