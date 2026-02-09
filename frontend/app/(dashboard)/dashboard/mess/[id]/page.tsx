'use client';

import { useParams } from 'next/navigation';
import { Users, Shield, Crown, ChefHat, Settings, UserPlus, AlertCircle, Copy, X, Star, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { messService, Role, MessMember } from '@/services/mess.service';
import { useMessContext } from '@/contexts/MessContext';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

const roleConfig: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
    admin: { label: 'Admin', icon: Shield, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    manager: { label: 'Manager', icon: Star, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    member: { label: 'Member', icon: User, color: 'text-gray-600', bgColor: 'bg-gray-50' },
};

export default function MessDetailsPage() {
    const { isAdmin } = useMessContext();
    const params = useParams();
    const messId = decodeURIComponent(params.id as string);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showRequestsModal, setShowRequestsModal] = useState(false);
    const [isApproving, setIsApproving] = useState<string | null>(null);

    // Fetch mess details from API
    const { data: mess, isLoading, error } = useQuery({
        queryKey: ['mess-details', messId],
        queryFn: () => messService.getMessDetails(messId),
    });

    const [selectedMember, setSelectedMember] = useState<MessMember | null>(null);
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    const handleRoleToggle = async (member: MessMember, role: Role) => {
        setIsUpdatingRole(true);
        const hasRole = member.roles.includes(role);
        try {
            if (hasRole) {
                await messService.removeRole(messId, member.user_id, role);
                toast.success(`${role} role removed`);
            } else {
                await messService.assignRole(messId, member.user_id, role);
                toast.success(`${role} role assigned`);
            }
            // Refresh
            window.location.reload();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update role');
        } finally {
            setIsUpdatingRole(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Mess ID copied to clipboard!');
    };

    const handleApprove = async (memberId: string) => {
        setIsApproving(memberId);
        try {
            await messService.approveMember(messId, memberId);
            toast.success('Member approved successfully!');
            // Refresh mess details
            window.location.reload(); // Simple refresh for now to update all state
        } catch (err: any) {
            toast.error(err.message || 'Failed to approve member');
        } finally {
            setIsApproving(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error || !mess) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Mess Not Found</h2>
                    <p className="text-gray-600 mb-4">Unable to load mess details</p>
                    <Link
                        href="/dashboard/mess"
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        ← Back to Messes
                    </Link>
                </div>
            </div>
        );
    }

    const activeMembers = mess.members.filter(m => m.status === 'active');
    const pendingRequests = mess.members.filter(m => m.status === 'pending');
    const adminCount = activeMembers.filter(m => m.roles.includes('admin')).length;
    const managerCount = activeMembers.filter(m => m.roles.includes('manager')).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{mess.name}</h1>
                    <p className="text-gray-600 mt-1">ID: {mess.id}</p>
                </div>
                <Link
                    href="/dashboard/mess"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                    ← Back to Messes
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Members</p>
                            <p className="text-2xl font-bold text-gray-900">{activeMembers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Crown className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Admins</p>
                            <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Star className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Managers</p>
                            <p className="text-2xl font-bold text-gray-900">{managerCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Members List */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Members</h3>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl transition-all"
                    >
                        <UserPlus className="w-5 h-5" />
                        <span>Invite</span>
                    </button>
                </div>

                {activeMembers.length > 0 ? (
                    <div className="space-y-3">
                        {activeMembers.map((member) => (
                            <div
                                key={member.user_id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold ring-4 ring-white">
                                        {(member.user_name || member.user_id)[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{member.user_name || member.user_id}</p>
                                        <p className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{member.user_id}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {member.roles.map((role) => {
                                                const config = roleConfig[role];
                                                if (!config) return null;
                                                const Icon = config.icon;
                                                return (
                                                    <div
                                                        key={role}
                                                        className={`flex items-center space-x-1 px-2 py-0.5 rounded-full ${config.bgColor}`}
                                                    >
                                                        <Icon className={`w-3 h-3 ${config.color}`} />
                                                        <span className={`text-[10px] font-black uppercase ${config.color}`}>
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() => setSelectedMember(member)}
                                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                    >
                                        <Settings className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No active members yet</p>
                        <p className="text-sm text-gray-500 mt-1">Invite members to get started</p>
                    </div>
                )}
            </div>

            {/* Management Actions */}
            {isAdmin && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-emerald-600" />
                        <span>Administrative Tools</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setShowRequestsModal(true)}
                            className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-emerald-50 hover:border-emerald-100 border border-transparent transition-all group"
                        >
                            <div>
                                <p className="font-bold text-gray-900 group-hover:text-emerald-700">Pending Requests</p>
                                <p className="text-xs text-gray-500 mt-1">Review new join requests</p>
                            </div>
                            <span className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${pendingRequests.length > 0 ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-gray-200 text-gray-500'}`}>
                                {pendingRequests.length}
                            </span>
                        </button>
                        <button
                            className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:border-blue-100 border border-transparent transition-all group"
                            onClick={() => toast.success("Refined settings coming soon!")}
                        >
                            <div>
                                <p className="font-bold text-gray-900 group-hover:text-blue-700">Mess Config</p>
                                <p className="text-xs text-gray-500 mt-1">Update name, rules & limits</p>
                            </div>
                            <Settings className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                        </button>
                    </div>
                </div>
            )}

            {/* Role Management Modal */}
            {selectedMember && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-gray-100">
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                                <Users className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Manage Member</h3>
                            <p className="text-gray-500 text-sm mt-2">
                                Settings for <span className="font-black text-emerald-600">{selectedMember.user_name || selectedMember.user_id}</span>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Roles & Permissions</p>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleRoleToggle(selectedMember, 'manager')}
                                        disabled={isUpdatingRole}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedMember.roles.includes('manager')
                                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                                            : 'bg-white border-gray-100 text-gray-600 hover:border-emerald-200'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Star className={`w-5 h-5 ${selectedMember.roles.includes('manager') ? 'text-amber-500' : 'text-gray-300'}`} />
                                            <span className="font-bold">Manager Role</span>
                                        </div>
                                        <div className={`w-10 h-6 rounded-full relative transition-colors ${selectedMember.roles.includes('manager') ? 'bg-amber-500' : 'bg-gray-300'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${selectedMember.roles.includes('manager') ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </div>
                                    </button>

                                    <button
                                        disabled
                                        className="w-full flex items-center justify-between p-4 rounded-xl border-2 bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Shield className="w-5 h-5 text-gray-300" />
                                            <span className="font-bold">Admin Role</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase">Protected</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex space-x-3">
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <button
                            onClick={() => setShowInviteModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserPlus className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Invite Members</h3>
                            <p className="text-gray-600 mt-2">
                                Share this Mess ID with others. They can use it to send a join request.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-sm font-medium text-gray-500 mb-2 text-center uppercase tracking-wider">
                                Mess ID / Invite Code
                            </p>
                            <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3 group">
                                <span className="text-xl font-mono font-bold text-gray-900">{mess.id}</span>
                                <button
                                    onClick={() => copyToClipboard(mess.id)}
                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                    title="Copy to clipboard"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col space-y-3">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Requests Modal */}
            {showRequestsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                        <button
                            onClick={() => setShowRequestsModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Pending Join Requests</h3>
                            <p className="text-gray-600 mt-1">
                                Review and approve users who want to join this mess.
                            </p>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {pendingRequests.length > 0 ? (
                                pendingRequests.map((request) => (
                                    <div
                                        key={request.user_id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold">
                                                {(request.user_name || request.user_id)[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{request.user_name || request.user_id}</p>
                                                <p className="text-xs text-gray-500">ID: {request.user_id}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleApprove(request.user_id)}
                                            disabled={isApproving === request.user_id}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
                                        >
                                            {isApproving === request.user_id ? 'Approv...' : 'Approve'}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Users className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600">No pending requests</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setShowRequestsModal(false)}
                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
