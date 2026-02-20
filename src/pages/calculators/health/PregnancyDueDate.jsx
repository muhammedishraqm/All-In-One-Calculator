import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Baby } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function PregnancyDueDate() {
    const { addCalculation } = useHistoryContext();
    const [lmpDate, setLmpDate] = useState('');
    const [cycleLength, setCycleLength] = useState(28);

    const result = useMemo(() => {
        if (!lmpDate) return null;

        const lmp = new Date(lmpDate);
        if (isNaN(lmp.getTime())) return { error: 'Invalid Date' };

        // Naegele's rule variation: + 280 days + (cycleLength - 28)
        const diffDays = cycleLength - 28;
        
        const dueDate = new Date(lmp);
        dueDate.setDate(dueDate.getDate() + 280 + diffDays);

        const today = new Date();
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const weeksPregnant = Math.floor((280 + diffDays - daysRemaining) / 7);

        return {
            dueDateStr: dueDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            daysRemaining,
            weeksPregnant,
            progressPercent: Math.min(100, Math.max(0, ((280 + diffDays - daysRemaining) / (280 + diffDays)) * 100))
        };
    }, [lmpDate, cycleLength]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'Due Date',
             details: `LMP: ${lmpDate}`,
             result: result.dueDateStr,
             category: 'Baby'
        });
    }

    return (
        <CalculatorLayout
            title="Pregnancy Due Date"
            description="Estimate timeline based on LMP and cycle length."
            icon={Baby}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="card p-6 space-y-6">
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Day of Last Period (LMP)</label>
                         <input type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" />
                    </div>

                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex justify-between">
                             <span>Average Cycle Length</span>
                             <span className="text-pink-500">{cycleLength} Days</span>
                         </label>
                         <input type="range" min="20" max="45" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} onMouseUp={handleLog} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-pink-500" />
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-pink-50 to-white dark:from-pink-900/20 dark:to-surface-dark border-pink-100 dark:border-pink-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-6">
                                <p className="text-sm font-bold tracking-wider text-pink-500 dark:text-pink-400 uppercase">Estimated Due Date</p>
                                <h2 className="text-4xl font-black text-pink-600 dark:text-pink-400 tracking-tight leading-tight">
                                    {result.dueDateStr}
                                </h2>

                                {result.daysRemaining > 0 ? (
                                    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col space-y-4">
                                        <div className="grid grid-cols-2 gap-4 divide-x divide-gray-100 dark:divide-gray-700">
                                            <div>
                                                 <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Weeks Pregnant</p>
                                                 <p className={`text-3xl font-bold uppercase tracking-widest text-gray-900 dark:text-white`}>
                                                     {result.weeksPregnant} W
                                                 </p>
                                            </div>
                                            <div>
                                                 <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Days Remaining</p>
                                                 <p className={`text-3xl font-bold uppercase tracking-widest text-pink-500 dark:text-pink-400`}>
                                                     {result.daysRemaining}
                                                 </p>
                                            </div>
                                        </div>

                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 mt-2">
                                            <div className="bg-pink-500 h-3 rounded-full" style={{ width: `${result.progressPercent}%` }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">Due date has passed!</p>
                                    </div>
                                )}
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Baby size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter your LMP to calculate timeline.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
