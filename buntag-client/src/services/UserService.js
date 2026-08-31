import axios from "axios";
import constants from "../constants";

const API = axios.create({
    baseURL: `${constants.HOST}/user`,
});

// Attach token automatically if present
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Admin only (backend enforces this too)
export const fetchUsers = () => API.get("/");
export const fetchUserById = (id) => API.get(`/${id}`);
export const updateUser = (id, user) => API.put(`/${id}`, user);
export const deleteUser = (id) => API.delete(`/${id}`);

// Public
export const registerUser = (user) => API.post("/", user);
export const loginUser = (credentials) => API.post("/login", credentials);

export const createUser = registerUser;