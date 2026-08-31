import axios from "axios";
import constants from "../constants";

const API = axios.create({
    baseURL: `${constants.HOST}/product`,
});

// Attach token automatically if present
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Public
export const fetchProducts = (params = {}) =>
    API.get("/", { params });

export const fetchProductById = (id) =>
    API.get(`/${id}`);

// Supplier + Admin
export const createProduct = (product) =>
    API.post("/", product);

export const updateProduct = (id, product) =>
    API.put(`/${id}`, product);

export const deleteProduct = (id) =>
    API.delete(`/${id}`);

export default API;