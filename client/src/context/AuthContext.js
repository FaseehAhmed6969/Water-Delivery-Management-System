import React, { createContext, useState, useEffect } from 'react';
import { getUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await getUser();
                setUser(response.data);
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    const loginUser = (token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};
