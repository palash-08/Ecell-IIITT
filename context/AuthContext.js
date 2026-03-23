'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

// Initialize with null to distinguish from undefined (provider missing)
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data.data);
                } catch (err) {
                    console.error('Session expired or invalid token');
                    if (typeof window !== 'undefined') localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUserLoggedIn();
    }, []);

    // Register User
    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);
            if (typeof window !== 'undefined') localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            router.push('/');
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Registration failed'
            };
        }
    };

    // Login User
    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            if (typeof window !== 'undefined') localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            
            // Redirect based on role
            if (res.data.user.role === 'admin' || res.data.user.role === 'super-admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Login failed'
            };
        }
    };

    // Forgot Password
    const forgotPassword = async (email) => {
        try {
            await api.post('/auth/forgotpassword', { email });
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Failed to send OTP'
            };
        }
    };

    // Reset Password
    const resetPassword = async (email, otp, password) => {
        try {
            const res = await api.post('/auth/resetpassword', { email, otp, password });
            if (typeof window !== 'undefined') localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            router.push('/');
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || 'Reset password failed'
            };
        }
    };

    // Logout User
    const logout = () => {
        if (typeof window !== 'undefined') localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
                forgotPassword,
                resetPassword,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        // This will help us confirm if we are outside the provider
        console.error("useAuth must be used within an AuthProvider");
        return { user: null, loading: false, login: () => {}, logout: () => {}, register: () => {}, forgotPassword: () => {}, resetPassword: () => {} };
    }
    return context;
};
