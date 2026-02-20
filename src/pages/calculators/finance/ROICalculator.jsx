import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Percent } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function ROICalculator() {
    const { addCalculation } = useHistoryContext();
    const [initialAmount, setInitialAmount] = useState('');
    const [finalAmount, setFinalAmount] = useState('');

    const result = useMemo(() => {
        if (!initialAmount || !finalAmount) return null;
        const init = parseFloat(initialAmount);
        const final = parseFloat(finalAmount);

        if (isNaN(init) || isNaN(final) || init <= 0) return { error: 'Invalid initial investment' };

        const returnAmount = final - init;
        const roiPercent = (returnAmount / init) * 100;

        return {
            amount: returnAmount,
            percent: roiPercent
        };
    }, [initialAmount, finalAmount]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'ROI Calculator',
             details: `${initialAmount} ➔ ${finalAmount}`,
             result: `${result.percent > 0 ? '+' : ''}${result.percent.toFixed(2)}%`,
             category: 'Percent'
        });
    }

    return (
        <CalculatorLayout
            title="Return on Investment (ROI)"
            description="Calculate the profitability of an investment."
            icon={Percent}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                             Initial Investment
                         </label>
                         <input
                             type="number"
                             min="0"
                             value={initialAmount}
                             onChange={(e) => setInitialAmount(e.target.value)}
                             onBlur={handleLog}
                             className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none"
                         />
                    </div>
                     <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                             Final Value (or Returns)
                         </label>
                         <input
                             type="number"
                             min="0"
                             value={finalAmount}
                             onChange={(e) => setFinalAmount(e.target.value)}
                             onBlur={handleLog}
                             className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none"
                         />
                     </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-surface-dark border-green-100 dark:border-green-900/50 flex flex-col justify-center items-center space-y-8">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-6 p-6 bg-white dark:bg-surface-light rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                
                                <div className="flex flex-col items-center">
                                    <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">
                                        Return on Investment (ROI)
                                    </p>
                                    <h2 className={`text-6xl font-black tracking-tight ${result.percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.percent >= 0 ? '+' : ''}{result.percent.toFixed(2)}%
                                    </h2>
                                </div>

                                <div className={`p-4 rounded-xl border mt-4 ${result.amount >= 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                                         Net Return Amount
                                     </p>
                                     <p className={`text-2xl font-bold ${result.amount >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                        {result.amount >= 0 ? '+' : ''}{result.amount.toLocaleString()}
                                     </p>
                                </div>

                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Percent size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter investment amounts to calculate ROI.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
