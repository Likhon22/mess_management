'use client';

import React from 'react';
import { Users, Plus, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export function NoMessView() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 relative">
                <Users className="w-12 h-12 text-emerald-600" />
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center border-4 border-white">
                    <LayoutGrid className="w-4 h-4 text-amber-600" />
                </div>
            </div>

            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">No Active Mess Membership</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
                You haven't joined any mess yet, or your join request is still pending approval from an admin.
                Finance and reporting features are only available to active mess members.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                    href="/dashboard/mess"
                    className="flex items-center space-x-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    <span>Join or Create a Mess</span>
                </Link>
                <Link
                    href="/dashboard"
                    className="text-gray-600 font-bold hover:text-emerald-600 px-6 py-4 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
