import axios from "axios";
import constants from "../constants";

const API = axios.create({
    baseURL: `${constants.HOST}/order`,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Customer
export const checkout = () => API.post("/");
export const fetchMyOrders = () => API.get("/my");
export const cancelMyOrder = (id) => API.put(`/${id}/cancel`);

// Supplier/Admin
export const fetchAllOrders = () => API.get("/");
export const updateOrderStatus = (id, status) => API.put(`/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/${id}`);

// Any logged-in role (ownership checked server-side)
export const fetchOrderById = (id) => API.get(`/${id}`);
