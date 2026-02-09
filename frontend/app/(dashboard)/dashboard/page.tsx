'use client';

import { useMe } from '@/hooks/useAuth';
import { Plus, Users, DollarSign, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: user } = useMe();

    const stats = [
        { label: 'Active Messes', value: user?.messes?.length || 0, icon: Users, color: 'bg-blue-50 text-blue-600' },
        { label: 'This Month', value: '৳0', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Meals Today', value: '0', icon: Utensils, color: 'bg-orange-50 text-orange-600' },
    ];

    const quickActions = [
        { label: 'Create Mess', href: '/dashboard/mess/create', icon: Plus, color: 'bg-emerald-600' },
        { label: 'Join Mess', href: '/dashboard/mess/join', icon: Users, color: 'bg-blue-600' },
        { label: 'Add Meal', href: '/dashboard/finance/meals', icon: Utensils, color: 'bg-orange-600' },
        { label: 'Add Bazar', href: '/dashboard/finance/bazar', icon: DollarSign, color: 'bg-purple-600' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                <p className="opacity-90">Manage your mess finances and track meals easily</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                                <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="font-medium text-gray-900">{action.label}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="text-center py-8">
                    <p className="text-gray-500">No recent activity</p>
                    <p className="text-sm text-gray-400 mt-1">Your mess activities will appear here</p>
                </div>
            </div>
        </div>
    );
}
