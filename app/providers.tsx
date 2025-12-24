'use client';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ToastProvider>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                <AuthProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </AuthProvider>
            </GoogleOAuthProvider>
        </ToastProvider>
    );
}
