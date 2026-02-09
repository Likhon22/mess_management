'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, Users, FileText, Settings, Utensils, CreditCard } from 'lucide-react';

const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/dashboard/finance/meals', icon: Utensils, label: 'Meals' },
    { href: '/dashboard/finance/costs', icon: DollarSign, label: 'Service Costs' },
    { href: '/dashboard/finance', icon: CreditCard, label: 'Finance' },
    { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const isActive = href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname === href || (pathname?.startsWith(href + '/') && !navItems.some(item => item.href !== href && item.href.startsWith(href) && pathname.startsWith(item.href)));

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center justify-center flex-1 h-full ${isActive ? 'text-emerald-600' : 'text-gray-600'
                                }`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs mt-1">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
