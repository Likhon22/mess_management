'use client';

import { useState } from 'react';
import { DollarSign, Plus, Trash2, Tag, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { financeService } from '@/services/finance.service';
import { useMessContext } from '@/contexts/MessContext';
import toast from 'react-hot-toast';
import type { ServiceCost } from '@/types/finance';
import { NoMessView } from '@/components/shared/NoMessView';
import { formatCurrency } from '@/lib/formatters';

const CATEGORIES = [
    'House Rent',
    'Electricity Bill',
    'Internet Bill',
    'Water Bill',
    'Waste Management (Moila)',
    'House Help (Bua)',
    'Gas Bill',
    'Service Charge (Lift/Security)',
    'Other'
];

export default function CostsPage() {
    const [showAddForm, setShowAddForm] = useState(false);
    const { currentMessId, isManager, isMemberOfAnyMess } = useMessContext();
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [isOtherCategory, setIsOtherCategory] = useState(false);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ServiceCost>();
    const queryClient = useQueryClient();

    // Fetch costs
    const { data: costs = [], isLoading } = useQuery({
        queryKey: ['service-costs', currentMessId, selectedMonth],
        queryFn: () => currentMessId ? financeService.getServiceCosts(currentMessId, selectedMonth) : Promise.resolve([]),
        enabled: !!currentMessId,
    });

    // Fetch summary to get active member count for accurate split
    const { data: summary } = useQuery({
        queryKey: ['monthly-summary', currentMessId, selectedMonth],
        queryFn: () => currentMessId ? financeService.getMonthlySummary(currentMessId, selectedMonth) : null,
        enabled: !!currentMessId,
    });

    const memberCount = summary ? Object.keys(summary.member_summaries).length : 1;

    // Add cost mutation
    const addMutation = useMutation({
        mutationFn: (cost: ServiceCost) => financeService.addServiceCost(cost),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-costs'] });
            queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
            toast.success('Cost recorded successfully!');
            setShowAddForm(false);
            reset();
            setIsOtherCategory(false);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to add cost');
        },
    });

    // Delete cost mutation
    const deleteMutation = useMutation({
        mutationFn: ({ messId, costId }: { messId: string; costId: string }) =>
            financeService.deleteServiceCost(messId, costId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-costs'] });
            queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
            toast.success('Cost deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete cost');
        },
    });

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'Other') {
            setIsOtherCategory(true);
            setValue('name', '');
        } else {
            setIsOtherCategory(false);
            setValue('name', value);
        }
    };

    const onSubmit = (data: ServiceCost) => {
        if (!currentMessId) {
            toast.error('Please select a mess first');
            return;
        }
        addMutation.mutate({
            ...data,
            mess_id: currentMessId,
            month: selectedMonth,
        });
    };

    const handleDelete = (costId: string) => {
        if (!currentMessId) return;
        if (confirm('Are you sure you want to delete this cost?')) {
            deleteMutation.mutate({ messId: currentMessId, costId });
        }
    };

    if (!isMemberOfAnyMess) {
        return <NoMessView />;
    }

    if (!currentMessId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <DollarSign className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center">No Mess Selected</h3>
                <p className="text-gray-500 mt-2 text-sm text-center">Please select a mess from the sidebar first</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Monthly Service Costs</h1>
                    <p className="text-gray-500 font-medium">Add and manage shared costs like Rent, Electricity, and Utilities</p>
                </div>
                {isManager && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center space-x-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-bold">Add New Cost</span>
                    </button>
                )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start space-x-4">
                <div className="bg-blue-500 text-white p-2 rounded-xl mt-0.5 shadow-sm shadow-blue-100">
                    <Info className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-sm font-black text-blue-900 uppercase tracking-wide flex items-center">
                        Shared Accounting Model
                    </p>
                    <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                        Every cost added here is **split equally** among all active members.
                        This includes fixed items like **Electricity** and **House Help**, as well as the monthly **House Rent**.
                    </p>
                </div>
            </div>

            {/* Month Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center space-x-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Active Month</label>
                <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                />
            </div>

            {/* Add Cost Form */}
            {showAddForm && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 animate-in slide-in-from-top duration-300">
                    <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight flex items-center">
                        <Tag className="w-5 h-5 mr-3 text-emerald-600" />
                        Record Shared Expense
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                                <select
                                    onChange={handleCategoryChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-gray-900"
                                >
                                    <option value="">Select Expense Type</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                {isOtherCategory && (
                                    <div className="mt-4 animate-in fade-in duration-300">
                                        <input
                                            {...register('name', { required: 'Custom category name is required' })}
                                            type="text"
                                            className="w-full px-4 py-3 bg-white border-2 border-emerald-500 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-gray-900 shadow-sm"
                                            placeholder="Enter Custom Category Name"
                                        />
                                    </div>
                                )}
                                {errors.name && <p className="mt-1 text-sm text-rose-600 font-bold ml-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Total Amount (৳)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">৳</div>
                                    <input
                                        {...register('amount', { required: 'Amount is required', valueAsNumber: true })}
                                        type="number"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-black text-gray-900 text-lg"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.amount && <p className="mt-1 text-sm text-rose-600 font-bold ml-1">{errors.amount.message}</p>}
                            </div>
                        </div>
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="submit"
                                disabled={addMutation.isPending}
                                className="px-8 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 disabled:bg-emerald-400 transition-all font-black uppercase text-sm tracking-widest shadow-lg shadow-emerald-100"
                            >
                                {addMutation.isPending ? 'Recording...' : 'Save Expense'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    reset();
                                    setIsOtherCategory(false);
                                }}
                                className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all font-black uppercase text-sm tracking-widest"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Costs List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">
                            Expenses for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">All approved shared costs for this period</p>
                    </div>
                    <div className="bg-white px-4 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">Count:</span>
                        <span className="font-black text-emerald-600">{costs?.length || 0}</span>
                    </div>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
                            <p className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Records...</p>
                        </div>
                    ) : costs?.length > 0 ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                                {costs.map((cost) => (
                                    <div
                                        key={cost.id}
                                        className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-lg tracking-tight">{cost.name}</p>
                                                <div className="flex items-center mt-1 space-x-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${cost.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {cost.status}
                                                    </span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Added {new Date().toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <p className="text-2xl font-black text-gray-900">{formatCurrency(cost.amount || 0)}</p>
                                            {isManager && (
                                                <button
                                                    onClick={() => cost.id && handleDelete(cost.id)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 p-8 bg-gray-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                <div className="mb-4 md:mb-0 relative z-10">
                                    <p className="text-emerald-400 font-black uppercase text-xs tracking-widest">Total Monthly Cost</p>
                                    <h4 className="text-4xl font-black text-white mt-1">{formatCurrency(costs?.reduce((sum: number, cost: ServiceCost) => sum + cost.amount, 0) || 0)}</h4>
                                </div>
                                <div className="text-center md:text-right relative z-10">
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Per Member Share ({memberCount} active)</p>
                                    <p className="text-xl font-black text-white bg-white/10 px-4 py-2 rounded-xl border border-white/10 italic">
                                        {formatCurrency(costs?.reduce((sum: number, cost: ServiceCost) => sum + cost.amount, 0) / Math.max(1, memberCount))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-white shadow-sm border border-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <DollarSign className="w-10 h-10" />
                            </div>
                            <p className="text-lg font-black text-gray-900 tracking-tight">No Costs Recorded</p>
                            <p className="text-sm text-gray-500 mt-2 font-medium">Managers can record shared expenses for this month.</p>
                            {isManager && (
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="mt-6 text-emerald-600 font-black uppercase text-xs tracking-widest hover:text-emerald-700 underline underline-offset-4"
                                >
                                    Record First Expense
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
