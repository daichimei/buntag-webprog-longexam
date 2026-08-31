import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser as loginRequest, registerUser as registerRequest } from '../services/UserService';

const AuthContext = createContext(null);

const getStoredUser = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const id = localStorage.getItem('id');
    const profilePicture = localStorage.getItem('profilePicture');
    if (!token || !role) return null;
    return { token, role, name, id, profilePicture: profilePicture || null };
    };

    export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredUser);
    const [authError, setAuthError] = useState(null);

    // Keep state in sync if another tab logs out
    useEffect(() => {
        const handleStorage = () => setUser(getStoredUser());
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const login = async (email, password) => {
        setAuthError(null);
        try {
        const { data } = await loginRequest({ email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
        localStorage.setItem('role', data.role);
        localStorage.setItem('name', data.name);
        if (data.profilePicture) {
            localStorage.setItem('profilePicture', data.profilePicture);
        } else {
            localStorage.removeItem('profilePicture');
        }
        setUser({ token: data.token, id: data.id, role: data.role, name: data.name, profilePicture: data.profilePicture || null });
        return { success: true, role: data.role };
        } catch (err) {
        const status = err?.response?.status;
        const message = err?.response?.data?.message;

        let friendlyMessage = 'Something went wrong. Please try again.';
        if (status === 404) friendlyMessage = 'No account found with that email.';
        else if (status === 401) friendlyMessage = 'Incorrect email or password.';
        else if (status === 403) friendlyMessage = message || 'Your account is inactive. Please contact support.';
        else if (status >= 500) friendlyMessage = 'Server error. Please try again later.';
        else if (message) friendlyMessage = message;

        setAuthError(friendlyMessage);
        return { success: false, message: friendlyMessage };
        }
    };

    const register = async (formData) => {
        setAuthError(null);
        try {
        await registerRequest(formData);
        // Auto-login right after registration for a seamless flow
        return await login(formData.email, formData.password);
        } catch (err) {
        const status = err?.response?.status;
        const message = err?.response?.data?.message;

        let friendlyMessage = 'Something went wrong. Please try again.';
        if (status === 400) friendlyMessage = message || 'Please check your details and try again.';
        else if (status >= 500) friendlyMessage = 'Server error. Please try again later.';
        else if (message) friendlyMessage = message;

        setAuthError(friendlyMessage);
        return { success: false, message: friendlyMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('profilePicture');
        setUser(null);
    };

    // Call after a profile edit so the navbar/UI reflect changes without a re-login
    const refreshUser = ({ name, profilePicture }) => {
        if (name !== undefined) localStorage.setItem('name', name);
        if (profilePicture !== undefined) {
            if (profilePicture) localStorage.setItem('profilePicture', profilePicture);
            else localStorage.removeItem('profilePicture');
        }
        setUser((prev) => (prev ? { ...prev, name: name ?? prev.name, profilePicture: profilePicture !== undefined ? profilePicture : prev.profilePicture } : prev));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, refreshUser, authError, setAuthError }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};