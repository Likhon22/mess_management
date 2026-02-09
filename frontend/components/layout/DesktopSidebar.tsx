'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, Users, FileText, Settings, LogOut, Utensils, CreditCard } from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import type { User } from '@/types/auth';

const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/mess', icon: Users, label: 'Mess Management' },
    { href: '/dashboard/finance/meals', icon: Utensils, label: 'Meal Sheet' },
    { href: '/dashboard/finance/costs', icon: DollarSign, label: 'Service Costs' },
    { href: '/dashboard/finance', icon: CreditCard, label: 'Finance' },
    { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
    { href: '/dashboard/profile', icon: Settings, label: 'Profile' },
];

export function DesktopSidebar({ user }: { user: User }) {
    const pathname = usePathname();
    const logout = useLogout();

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-emerald-600">আমার ডেরা</h1>
                    <p className="text-sm text-gray-600 mt-1">Mess Management</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const isActive = href === pathname ||
                            (href !== '/dashboard' && href !== '/dashboard/finance' && pathname.startsWith(href));

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-105 font-bold'
                                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="tracking-tight">{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold border-2 border-white shadow-sm">
                            {user.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.phone}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all duration-200 group font-medium"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
