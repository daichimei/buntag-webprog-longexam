import axios from "axios";
import constants from "../constants";

const API = axios.create({
    baseURL: `${constants.HOST}/cart`,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// All of these act on the logged-in user's own cart — never pass a userId
export const fetchMyCart = () => API.get("/");
export const addToCart = (productId, quantity = 1) => API.post("/", { productId, quantity });
export const updateCartItem = (productId, quantity) => API.put(`/item/${productId}`, { quantity });
export const removeCartItem = (productId) => API.delete(`/item/${productId}`);
export const clearCart = () => API.delete("/");
