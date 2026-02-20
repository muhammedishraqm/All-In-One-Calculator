import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { CalendarClock, CalendarDays, ArrowRight } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function DateDifference() {
    const { addCalculation } = useHistoryContext();
    const [date1, setDate1] = useState(new Date().toISOString().split('T')[0]);
    const [date2, setDate2] = useState('');

    const diffUnits = useMemo(() => {
        if (!date1 || !date2) return null;
        
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        
        const diffMs = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;
        
        let years = d2.getFullYear() - d1.getFullYear();
        let months = d2.getMonth() - d1.getMonth();
        let days = d2.getDate() - d1.getDate();

        if (d1 > d2) {
            years = d1.getFullYear() - d2.getFullYear();
            months = d1.getMonth() - d2.getMonth();
            days = d1.getDate() - d2.getDate();
        }

        if (days < 0) {
            months -= 1;
            const prevMonth = new Date(Math.max(d1.getFullYear(), d2.getFullYear()), Math.max(d1.getMonth(), d2.getMonth()), 0).getDate();
            days += prevMonth;
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        const exact = `${years}y, ${months}m, ${days}d`;
        
        return {
            exact,
            totalDays: diffDays,
            totalWeeks: diffWeeks,
            remainingDays: remainingDays
        };
    }, [date1, date2]);

    const handleLog = () => {
        if(!diffUnits) return;
        addCalculation({
            title: 'Date Difference',
            details: `From ${date1} to ${date2}`,
            result: `${diffUnits.totalDays} Days`,
            category: 'CalendarClock'
        });
    }

    return (
        <CalculatorLayout
            title="Date Difference"
            description="Find exact time elapsed between two dates."
            icon={CalendarClock}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Start Date
                        </label>
                        <div className="relative">
                            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="date"
                                required
                                value={date1}
                                onChange={(e) => setDate1(e.target.value)}
                                onBlur={handleLog}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-center">
                        <ArrowRight className="text-gray-300 dark:text-gray-600 rotate-90 lg:rotate-0" size={32} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            End Date
                        </label>
                        <div className="relative">
                            <CalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="date"
                                required
                                value={date2}
                                onChange={(e) => setDate2(e.target.value)}
                                onBlur={handleLog}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-surface-dark border-purple-100 dark:border-purple-900/50 flex flex-col justify-center space-y-6">
                     {diffUnits ? (
                        <>
                            <div className="text-center p-6 bg-white dark:bg-surface-light rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Exact Difference</p>
                                <h2 className="text-4xl font-black text-purple-600 dark:text-purple-400">
                                    {diffUnits.exact}
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                                    <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-widest">Total Days</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{diffUnits.totalDays}</p>
                                </div>
                                <div className="p-5 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                                    <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-widest">Total Weeks</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{diffUnits.totalWeeks} <span className="text-sm font-medium text-gray-400">+{diffUnits.remainingDays}d</span></p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-12">
                            <CalendarClock size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                            <p className="text-lg font-medium">Select both dates to see the difference.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
