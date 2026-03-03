import api from '@/lib/api';
import type { APIResponse, AuthResponse, User } from '@/types/auth';

export const authService = {
    async googleLogin(credential: string): Promise<AuthResponse> {
        const { data } = await api.post<APIResponse<AuthResponse>>('/auth/google', { credential });
        if (data.success && data.data) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            return data.data;
        }
        throw new Error(data.message || 'Google login failed');
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
