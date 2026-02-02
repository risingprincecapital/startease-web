'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/contexts/ToastContext';
import { environment } from '@/app/utils/env';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogle: (credential: string) => Promise<void>;
    loginWithEmail: (email: string) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT and check expiry
const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expiryTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true; // Treat invalid tokens as expired
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        checkAuth();

        // Set up periodic token validation (every 5 minutes)
        const intervalId = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token && isTokenExpired(token)) {
                console.log('Token expired, signing out...');
                logout();
            }
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(intervalId);
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            // Check if token is expired before making API call
            if (isTokenExpired(token)) {
                console.log('Token expired on load, signing out...');
                localStorage.removeItem('token');
                setUser(null);
                setLoading(false);
                return;
            }

            const response = await fetch(`${environment.API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async (credential: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${environment.API_URL}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ credential }),
            });

            const data: AuthResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);

            // Redirect admin users to admin dashboard
            if (data.user.isSuperAdmin) {
                router.push('/superadmin');
            } else if (data.user.isAdmin) {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error('Google login error:', error);
            showToast(error.message || 'Google login failed', 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const loginWithEmail = async (email: string) => {
        const response = await fetch(`${environment.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.error || data.message || 'Failed to send OTP';
            showToast(errorMessage, 'error');
            throw new Error(errorMessage);
        }
    };

    const verifyOTP = async (email: string, otp: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${environment.API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data: AuthResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Invalid OTP');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);

            // Redirect admin users to admin dashboard
            if (data.user.email === 'hi@starteaseai.com') {
                router.push('/superadmin');
            } else if (data.user.isAdmin) {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error('OTP verification error:', error);
            showToast(error.message || 'Invalid OTP', 'error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('theme');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                loginWithGoogle,
                loginWithEmail,
                verifyOTP,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
