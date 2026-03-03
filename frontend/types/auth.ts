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
    email: string;
    avatar?: string;
    phone?: string;
    messes: string[];
    join_requests?: string[];
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface GoogleLoginPayload {
    credential: string;
}

