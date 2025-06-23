import axios from "axios"; 
import config from "./config"
const token = localStorage.getItem("token");

const protectedInstance = axios.create({
  baseURL : config.API_URL,
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  }
});

const publicInstance = axios.create({
    baseURL : config.API_URL,
    headers: {
      "Content-Type": "application/json",
    }
});

protectedInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

    }, (error) => {
        return Promise.reject(error);
});

const publicGet = async (url, navigate) => {
    try {
        const response = await publicInstance({
            url,
            method: "GET"
        });

        return response?.data;

    } catch (err) {
        if(err?.response?.status === 401){
            localStorage.removeItem("token");
            navigate("/signin");
        }

        throw err;
    }
}

const publicPost = async (url, data, navigate) => {
    try {
        const response = await publicInstance({
            url,
            data: JSON.stringify(data),
            method: "POST"
        });

        return response.data;

    } catch (err) {
        if(err?.response?.status === 401){
            localStorage.removeItem("token");
            navigate("/signin");
        }

        throw err;
    }
}

const privateGet = async (url, navigate) => {
    try {
        const response = await protectedInstance({
            url,
            method: "GET"
        });

        return response?.data;

    } catch (err) {
        if(err?.response?.status === 401){
            localStorage.removeItem("token");
            navigate("/signin");
        }

        throw err;
    }
}

const privatePost = async (url, data, navigate) => {
    try {
        const response = await protectedInstance({
            url,
            data: JSON.stringify(data),
            method: "POST"
        });

        return response?.data;

    } catch (err) {
        if(err?.response?.status === 401){
            localStorage.removeItem("token");
            navigate("/signin");
        }

        throw err;
    }
}

export { publicGet, publicPost, privateGet, privatePost };