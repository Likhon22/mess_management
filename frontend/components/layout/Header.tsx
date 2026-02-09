'use client';

import { Bell } from 'lucide-react';
import type { User } from '@/types/auth';

export function Header({ user }: { user: User }) {
    return (
        <header className="bg-white shadow-sm lg:hidden">
            <div className="px-4 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">আমার ডেরা</h1>
                    <p className="text-sm text-gray-600">Welcome, {user.name}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                    <Bell className="w-6 h-6 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
