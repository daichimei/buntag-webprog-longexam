import axios from "axios";
import constants from "../constants";

const API = axios.create({
    baseURL: `${constants.HOST}/review`,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Public — works for guests too (no token needed, interceptor just won't attach one)
export const fetchReviewsByProduct = (productId) => API.get(`/product/${productId}`);

// Supplier/Admin only — moderation dashboard
export const fetchAllReviews = () => API.get("/");

// Customer only
export const createReview = (productId, rating, comment) =>
    API.post("/", { productId, rating, comment });

// Author, or supplier/admin (moderation)
export const updateReview = (id, data) => API.put(`/${id}`, data);
export const deleteReview = (id) => API.delete(`/${id}`);
