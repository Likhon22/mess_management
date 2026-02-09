'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/hooks/useAuth';
import type { LoginCredentials } from '@/types/auth';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();
    const login = useLogin();

    const onSubmit = async (data: LoginCredentials) => {
        try {
            await login.mutateAsync(data);
            toast.success('Login successful!');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">আমার ডেরা</h1>
                        <p className="text-gray-600">Welcome back to your mess</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                {...register('phone', { required: 'Phone is required' })}
                                type="tel"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900"
                                placeholder="01700000000"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                {...register('password', { required: 'Password is required' })}
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={login.isPending}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            {login.isPending ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
