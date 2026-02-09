'use client';

import { FileText, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useMessContext } from '@/contexts/MessContext';
import { NoMessView } from '@/components/shared/NoMessView';

export default function ReportsPage() {
    const { isMemberOfAnyMess } = useMessContext();

    if (!isMemberOfAnyMess) {
        return <NoMessView />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600 mt-1">View your mess financial reports and summaries</p>
            </div>

            {/* Coming Soon State */}
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Reports Coming Soon</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We're building comprehensive reports and analytics to help you track your mess expenses, meal rates, and member contributions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Monthly Reports</h3>
                        <p className="text-sm text-gray-600">Detailed breakdown of monthly expenses</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Trends Analysis</h3>
                        <p className="text-sm text-gray-600">Track spending patterns over time</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                            <DollarSign className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Member Dues</h3>
                        <p className="text-sm text-gray-600">Track who owes what amount</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
