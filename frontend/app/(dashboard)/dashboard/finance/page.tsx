'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    DollarSign, Utensils, ShoppingCart, CreditCard,
    TrendingUp, Users, AlertCircle, CheckCircle2,
    ArrowRight, ChevronRight, Plus, Eye, Home, Info, HelpCircle, Calendar
} from 'lucide-react';
import { financeService } from '@/services/finance.service';
import { useMessContext } from '@/contexts/MessContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { NoMessView } from '@/components/shared/NoMessView';
import { formatCurrency } from '@/lib/formatters';

export default function FinanceOverviewPage() {
    const { currentMessId, isManager, isMemberOfAnyMess } = useMessContext();
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [showAddCost, setShowAddCost] = useState(false);
    const queryClient = useQueryClient();

    // Fetch Summary
    const { data: summary, isLoading: isSummaryLoading } = useQuery({
        queryKey: ['monthly-summary', currentMessId, selectedMonth],
        queryFn: () => currentMessId ? financeService.getMonthlySummary(currentMessId, selectedMonth) : null,
        enabled: !!currentMessId,
    });

    // Fetch Service Costs for Breakdown Table
    const { data: serviceCosts = [] } = useQuery({
        queryKey: ['service-costs', currentMessId, selectedMonth],
        queryFn: () => currentMessId ? financeService.getServiceCosts(currentMessId, selectedMonth) : [],
        enabled: !!currentMessId,
    });

    if (!isMemberOfAnyMess) {
        return <NoMessView />;
    }

    const memberList = useMemo(() => {
        return summary?.member_summaries ? Object.values(summary.member_summaries) : [];
    }, [summary]);

    const activeMemberCount = memberList.length || 1;

    if (!currentMessId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No Mess Selected</h3>
                <p className="text-gray-500 mt-2 text-center max-w-sm">
                    Please select a mess from the sidebar to view finance details.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Finance Overview</h1>
                    <p className="text-gray-500 font-medium">Monthly Consolidated Balance Sheet</p>
                </div>

                <div className="flex items-center space-x-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="pl-3 pr-1 py-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Period</span>
                    </div>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                        <p className="text-gray-500 text-sm">Manage your mess finances efficiently</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href={`/dashboard/finance/payments`}>
                            <button className="flex items-center space-x-2 bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover:-translate-y-0.5 active:translate-y-0">
                                <CreditCard className="w-4 h-4" />
                                <span>Record Payment</span>
                            </button>
                        </Link>

                        <button
                            onClick={() => {
                                if (!isManager) {
                                    toast.error(
                                        (t) => (
                                            <div className="flex flex-col gap-2">
                                                <span className="font-extrabold text-rose-900">Manager Access Required</span>
                                                <div className="text-xs text-rose-800 opacity-90 leading-relaxed font-medium">
                                                    Only managers can add mess service costs. Visit your mess details to see who are the authorized managers.
                                                </div>
                                                <Link
                                                    href={`/dashboard/mess/${currentMessId}`}
                                                    onClick={() => toast.dismiss(t.id)}
                                                    className="bg-white text-rose-600 px-4 py-2 rounded-xl text-[10px] font-black tracking-tight text-center border border-rose-200 hover:bg-rose-50 transition-all uppercase shadow-md active:scale-95"
                                                >
                                                    View Members & Managers
                                                </Link>
                                            </div>
                                        ),
                                        {
                                            duration: 6000,
                                            position: 'top-center',
                                            style: {
                                                border: '1px solid #fee2e2',
                                                background: '#fff1f2',
                                                padding: '16px',
                                                borderRadius: '24px',
                                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                                            }
                                        }
                                    );
                                    return;
                                }
                                setShowAddCost(true);
                            }}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add New Cost</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Visual Logic Help Box */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="flex items-center space-x-3 mb-4">
                        <Home className="w-6 h-6" />
                        <h3 className="text-lg font-black uppercase tracking-wider">House Accounting Logic</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-end border-b border-white/20 pb-2">
                            <span className="text-xs font-bold text-blue-100 uppercase">Total Monthly Bills</span>
                            <span className="text-xl font-black">{formatCurrency(summary?.total_service_cost || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-blue-100">Divided by {activeMemberCount} Active Members</span>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-blue-200">Result:</span>
                                <span className="font-black bg-white/20 px-3 py-1 rounded-lg">{formatCurrency((summary?.total_service_cost || 0) / activeMemberCount)} / person</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="flex items-center space-x-3 mb-4">
                        <Utensils className="w-6 h-6" />
                        <h3 className="text-lg font-black uppercase tracking-wider">Meal Accounting Logic</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-end border-b border-white/20 pb-2">
                            <span className="text-xs font-bold text-orange-100 uppercase">Total Bazar Cost / Total Meals</span>
                            <span className="text-xl font-black">{formatCurrency(summary?.meal_rate || 0)} / meal</span>
                        </div>
                        <div className="text-sm font-medium text-orange-100">
                            Calculation: <span className="font-black text-white px-2 italic">Your Eat Count × Meal Rate</span> = Your Cost
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Breakdown Tables */}
            <div className="grid grid-cols-1 gap-12">

                {/* House Account Summary */}
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 bg-gray-50 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <Home className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">House Account Status</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Share based on **Rent + Utilities**</p>
                            </div>
                        </div>
                        <div className="md:flex items-center hidden space-x-6 text-right">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Members</p>
                                <p className="text-lg font-black text-blue-600">{activeMemberCount}</p>
                            </div>
                            <div className="w-px h-8 bg-gray-200"></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Individual Share</p>
                                <p className="text-lg font-black text-gray-900 border-b-2 border-emerald-500">{formatCurrency((summary?.total_service_cost || 0) / activeMemberCount)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-8 py-4">Participant</th>
                                    <th className="px-6 py-4 text-right">Debit (Share)</th>
                                    <th className="px-6 py-4 text-right">Credit (Paid)</th>
                                    <th className="px-8 py-4 text-right">Consolidated Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {memberList.map((m) => (
                                    <tr key={`${m.user_id}_house`} className="hover:bg-blue-50/10 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="font-black text-gray-900 block text-lg uppercase">{m.name || 'Unknown'}</span>
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Verified Member</span>
                                        </td>
                                        <td className="px-6 py-6 text-right font-black text-gray-500">{formatCurrency(m.service_share || 0)}</td>
                                        <td className="px-6 py-6 text-right font-black text-emerald-600 text-lg">{formatCurrency(m.house_paid || 0)}</td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={`px-5 py-2.5 rounded-[18px] text-sm font-black shadow-sm ring-1 ${m.house_balance >= 0 ? 'bg-emerald-500 text-white ring-emerald-400' : 'bg-rose-500 text-white ring-rose-400'}`}>
                                                {m.house_balance >= 0 ? '+' : ''}{formatCurrency(m.house_balance || 0)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Meal Account Summary */}
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 bg-gray-50 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                                <Utensils className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Meal Account Status</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Share based on **Actual Consumption**</p>
                            </div>
                        </div>
                        <div className="md:flex items-center hidden space-x-6 text-right">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Meal Rate</p>
                                <p className="text-lg font-black text-orange-600">{formatCurrency(summary?.meal_rate || 0)}</p>
                            </div>
                            <div className="w-px h-8 bg-gray-200"></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Mess Meals</p>
                                <p className="text-lg font-black text-gray-900">{summary?.total_meals?.toString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-orange-50/20 text-orange-900 text-[10px] font-black uppercase tracking-widest border-b border-orange-100">
                                    <th className="px-8 py-4">Participant</th>
                                    <th className="px-6 py-4 text-center">Meals Eaten</th>
                                    <th className="px-6 py-4 text-right">Debit (Cost)</th>
                                    <th className="px-6 py-4 text-right">Total Paid</th>
                                    <th className="px-8 py-4 text-right">Final Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {memberList.map((m) => (
                                    <tr key={`${m.user_id}_meal`} className="hover:bg-orange-50/10 transition-colors">
                                        <td className="px-8 py-6 font-black text-gray-900 text-lg uppercase">{m.name || 'Unknown'}</td>
                                        <td className="px-6 py-6 text-center">
                                            <span className="font-black bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                                                {m.total_meals} meals
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right font-black text-gray-500">{formatCurrency(m.meal_cost || 0)}</td>
                                        <td className="px-6 py-6 text-right">
                                            <span className="font-black text-emerald-600 text-lg">{formatCurrency(m.meal_paid)}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={`px-5 py-2.5 rounded-[18px] text-sm font-black shadow-sm ring-1 ${m.meal_balance >= 0 ? 'bg-orange-500 text-white ring-orange-400' : 'bg-rose-500 text-white ring-rose-400'}`}>
                                                {m.meal_balance >= 0 ? '+' : ''}{formatCurrency(m.meal_balance || 0)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Individual Service Breakdown Card */}
                <div className="lg:col-span-1 bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div className="p-8 bg-gray-900 border-b border-gray-800 flex items-center justify-between text-white">
                        <div className="flex items-center space-x-3">
                            <Info className="w-5 h-5 text-emerald-400" />
                            <h3 className="font-black uppercase text-xs tracking-widest">Monthly Service Costs (Total)</h3>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100 flex-1">
                        {serviceCosts?.length > 0 ? (
                            serviceCosts.filter(c => c.status === 'approved').map(c => (
                                <div key={c.id} className="flex justify-between items-center p-6 group hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-black text-gray-800 text-lg">{c.name}</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}</p>
                                    </div>
                                    <span className="font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl ring-1 ring-emerald-100 scale-110 group-hover:scale-125 transition-transform">{formatCurrency(c.amount || 0)}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-16 text-center text-gray-400 italic">No approved service costs this month</div>
                        )}
                    </div>
                    <div className="p-8 bg-emerald-600 text-white text-center font-black uppercase tracking-widest flex items-center justify-between">
                        <span>Grand Total House Bills:</span>
                        <span className="text-2xl">{formatCurrency(summary?.total_service_cost || 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
