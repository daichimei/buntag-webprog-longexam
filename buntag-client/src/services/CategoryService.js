import axios from "axios";
import constants from "../constants";

const API = axios.create({
    baseURL: `${constants.HOST}/category`,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Public
export const fetchCategories = () => API.get("/");

// Supplier/Admin only
export const createCategory = (category) => API.post("/", category);
export const updateCategory = (id, category) => API.put(`/${id}`, category);
export const deleteCategory = (id) => API.delete(`/${id}`);
