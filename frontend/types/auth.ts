// API Response wrapper
export interface APIResponse<T = any> {
    success: boolean;
    statusCode: number;
    message?: string;
    data?: T;
    error?: any;
}

// User & Auth types
export interface User {
    id: string;
    name: string;
    phone: string;
    messes: string[];
    join_requests?: string[];
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    phone: string;
    password: string;
}

export interface SignupData {
    name: string;
    phone: string;
    password: string;
}
