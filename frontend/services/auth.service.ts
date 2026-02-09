import api from '@/lib/api';
import type { APIResponse, AuthResponse, LoginCredentials, SignupData, User } from '@/types/auth';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await api.post<APIResponse<AuthResponse>>('/auth/login', credentials);
        if (data.success && data.data) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            return data.data;
        }
        throw new Error(data.message || 'Login failed');
    },

    async signup(signupData: SignupData): Promise<AuthResponse> {
        const { data } = await api.post<APIResponse<AuthResponse>>('/auth/signup', signupData);
        if (data.success && data.data) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            return data.data;
        }
        throw new Error(data.message || 'Signup failed');
    },

    async getMe(): Promise<User> {
        const { data } = await api.get<APIResponse<User>>('/users/me');
        if (data.success && data.data) {
            localStorage.setItem('user', JSON.stringify(data.data));
            return data.data;
        }
        throw new Error(data.message || 'Failed to fetch user');
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getStoredUser(): User | null {
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('token');
    },
};
