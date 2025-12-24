export interface User {
    _id: string;
    email: string;
    name: string;
    profileImage?: string;
    authProvider: 'email' | 'google';
    role: 'user' | 'admin' | 'superadmin';
    isVerified: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    createdAt?: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
    message?: string;
    error?: string;
}
