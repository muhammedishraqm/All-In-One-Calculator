import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Percent, TrendingUp, TrendingDown, Equal } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function PercentChange() {
    const { addCalculation } = useHistoryContext();
    const [initialVal, setInitialVal] = useState('');
    const [finalVal, setFinalVal] = useState('');

    const result = useMemo(() => {
        if (initialVal === '' || finalVal === '') return null;
        const v1 = parseFloat(initialVal);
        const v2 = parseFloat(finalVal);

        if (isNaN(v1) || isNaN(v2)) return { error: 'Please enter valid numbers' };
        if (v1 === 0) return { error: 'Initial value cannot be zero' };

        const difference = v2 - v1;
        const percentChange = (difference / Math.abs(v1)) * 100;

        let icon = Equal;
        let color = 'text-gray-500';
        let bg = 'bg-gray-100 dark:bg-gray-800';
        let text = 'No Change';

        if (percentChange > 0) {
            icon = TrendingUp;
            color = 'text-green-500';
            bg = 'bg-green-100 dark:bg-green-900/40';
            text = 'Increase';
        } else if (percentChange < 0) {
            icon = TrendingDown;
            color = 'text-red-500';
            bg = 'bg-red-100 dark:bg-red-900/40';
            text = 'Decrease';
        }

        return {
            diff: difference,
            percent: percentChange,
            icon,
            color,
            bg,
            text
        };
    }, [initialVal, finalVal]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'Percentage Change',
             details: `${initialVal} to ${finalVal}`,
             result: `${result.percent > 0 ? '+' : ''}${result.percent.toFixed(2)}%`,
             category: 'Percent'
        });
    }

    return (
        <CalculatorLayout
            title="Percentage Change"
            description="Calculate relative change between two values quickly."
            icon={Percent}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                             Initial Value (V1)
                         </label>
                         <input
                             type="number"
                             value={initialVal}
                             onChange={(e) => setInitialVal(e.target.value)}
                             onBlur={handleLog}
                             placeholder="e.g. 150"
                             className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium font-mono"
                         />
                    </div>
                     <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                             Final Value (V2)
                         </label>
                         <input
                             type="number"
                             value={finalVal}
                             onChange={(e) => setFinalVal(e.target.value)}
                             onBlur={handleLog}
                             placeholder="e.g. 200"
                             className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium font-mono"
                         />
                     </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-surface-dark border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-6 p-6 bg-white dark:bg-surface-light rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                
                                <div className="flex flex-col items-center">
                                    <div className={`p-4 rounded-full mb-4 ${result.bg} ${result.color}`}>
                                        <result.icon size={32} strokeWidth={3} />
                                    </div>
                                    <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">
                                        Percentage {result.text}
                                    </p>
                                    <h2 className={`text-5xl font-black tracking-tight ${result.color}`}>
                                        {Math.abs(result.percent).toPrecision(5).replace(/\.?0+$/, '')}%
                                    </h2>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 mt-4">
                                     <p className="text-xs font-semibold text-gray-400 mb-1">Absolute Difference</p>
                                     <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        {result.diff > 0 ? '+' : ''}{result.diff.toPrecision(5).replace(/\.?0+$/, '')}
                                     </p>
                                </div>

                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Percent size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter values to see relative change.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
