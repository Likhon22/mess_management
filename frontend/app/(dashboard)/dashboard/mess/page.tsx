'use client';

import { useMe } from '@/hooks/useAuth';
import { Plus, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MessPage() {
    const { data: user } = useMe();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Messes</h1>
                    <p className="text-gray-600 mt-1">Manage your mess memberships</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    href="/dashboard/mess/create"
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-emerald-500"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Plus className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Create New Mess</h3>
                            <p className="text-sm text-gray-600">Start your own mess</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/dashboard/mess/join"
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-500"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Join Existing Mess</h3>
                            <p className="text-sm text-gray-600">Enter mess ID to join</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* User's Messes */}
            <div className="space-y-6">
                {user?.join_requests && user.join_requests.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            Pending Requests
                            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                {user.join_requests.length}
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.join_requests.map((messId) => (
                                <div
                                    key={messId}
                                    className="bg-amber-50/50 border border-amber-100 rounded-xl p-6 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-1 rounded-bl-lg">
                                            Awaiting Approval
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Mess</h3>
                                            <p className="text-sm text-gray-600">{messId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-amber-700">
                                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
                                        Request is being reviewed by the mess manager
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Messes</h2>
                    {user?.messes && user.messes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.messes.map((messId) => (
                                <Link
                                    key={messId}
                                    href={`/dashboard/mess/${messId}`}
                                    className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                <Users className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Mess</h3>
                                                <p className="text-sm text-gray-600">{messId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="text-sm text-emerald-600 font-medium">View Details</span>
                                        <ArrowRight className="w-4 h-4 text-emerald-600" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messes Yet</h3>
                            <p className="text-gray-600 mb-6">Create a new mess or join an existing one to get started</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/dashboard/mess/create"
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    Create Mess
                                </Link>
                                <Link
                                    href="/dashboard/mess/join"
                                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Join Mess
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
