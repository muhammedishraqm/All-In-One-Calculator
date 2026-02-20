import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Activity } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function XirrCalculator() {
    const { addCalculation } = useHistoryContext();
    const [cashflows, setCashflows] = useState([{ amount: '-10000', date: '' }, { amount: '12000', date: '' }]);

    const updateFlow = (index, field, value) => {
        const newFlows = [...cashflows];
        newFlows[index][field] = value;
        setCashflows(newFlows);
    };

    const addFlow = () => setCashflows([...cashflows, { amount: '', date: '' }]);
    const removeFlow = (index) => setCashflows(cashflows.filter((_, i) => i !== index));

    const result = useMemo(() => {
        // Basic XIRR implementation using Newton-Raphson approximation
        const flows = cashflows.map(f => {
            return {
                amount: parseFloat(f.amount),
                date: new Date(f.date).getTime()
            }
        }).filter(f => !isNaN(f.amount) && !isNaN(f.date));

        if (flows.length < 2) return null;

        let hasPos = false;
        let hasNeg = false;
        flows.forEach(f => {
            if (f.amount > 0) hasPos = true;
            if (f.amount < 0) hasNeg = true;
        });

        if (!hasPos || !hasNeg) return { error: 'Need at least one positive and one negative flow' };

        const d0 = flows[0].date;
        const xirrEq = (r) => {
            return flows.reduce((sum, f) => {
                const days = (f.date - d0) / (1000 * 60 * 60 * 24);
                return sum + f.amount / Math.pow(1 + r, days / 365);
            }, 0);
        };

        const xirrDeriv = (r) => {
            return flows.reduce((sum, f) => {
                const days = (f.date - d0) / (1000 * 60 * 60 * 24);
                return sum - (days / 365) * f.amount / Math.pow(1 + r, (days / 365) + 1);
            }, 0);
        };

        let r = 0.1; // Initial guess 10%
        let err = 1e-6;
        let maxIters = 100;

        for (let i = 0; i < maxIters; i++) {
            let fVal = xirrEq(r);
            let fDeriv = xirrDeriv(r);
            if (Math.abs(fDeriv) < 1e-10) break; // Div by zero prevent
            let nextR = r - fVal / fDeriv;
            if (Math.abs(nextR - r) < err) {
                return { xirr: nextR * 100 };
            }
            r = nextR;
        }

        return { error: 'Cannot converge to an XIRR value' };
    }, [cashflows]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'XIRR',
             details: `${cashflows.length} cashflows`,
             result: `${result.xirr.toFixed(2)}%`,
             category: 'Activity'
        });
    }

    return (
        <CalculatorLayout
            title="XIRR Calculator"
            description="Calculate Extended Internal Rate of Return for irregular cash flows."
            icon={Activity}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-4 max-h-[600px] overflow-y-auto">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Cash Flows (Negative = Investment, Positive = Return)</p>
                    
                    {cashflows.map((flow, idx) => (
                        <div key={idx} className="flex gap-2 items-end bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 relative">
                            <span className="absolute bg-white dark:bg-gray-700 text-[10px] w-5 h-5 flex items-center justify-center rounded-full -top-2 -left-2 text-gray-400 font-bold border border-gray-200 dark:border-gray-600 shadow-sm">{idx + 1}</span>
                            <div className="flex-1">
                                <label className="block text-[10px] font-semibold text-gray-500 mb-1 ml-1">Amount</label>
                                <input
                                    type="number"
                                    value={flow.amount}
                                    onChange={(e) => updateFlow(idx, 'amount', e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-lg outline-none font-medium text-sm"
                                    placeholder="-1000"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-semibold text-gray-500 mb-1 ml-1">Date</label>
                                <input
                                    type="date"
                                    value={flow.date}
                                    onChange={(e) => updateFlow(idx, 'date', e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-lg outline-none font-medium text-sm"
                                />
                            </div>
                            {cashflows.length > 2 && (
                                <button onClick={() => removeFlow(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg mb-[2px]">
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                    <button onClick={addFlow} className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 font-bold text-sm tracking-wider uppercase hover:border-primary-500 hover:text-primary-500 transition-colors">
                        + Add Cashflow
                    </button>
                    <button onClick={handleLog} className="w-full py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-bold shadow-lg shadow-primary-500/30 transition-colors">
                        Calculate XIRR
                    </button>
                </div>

                <div className="card p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-surface-dark border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold p-4 bg-red-50 dark:bg-red-900/20 rounded-xl w-full text-center border border-red-200 dark:border-red-800">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-6">
                                <p className="text-sm font-bold tracking-wider text-indigo-500 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-4 py-1.5 rounded-full inline-block">Estimated XIRR</p>
                                <h2 className={`text-6xl font-black tracking-tight ${result.xirr >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {result.xirr >= 0 ? '+' : ''}{result.xirr.toFixed(2)}%
                                </h2>
                                
                                <p className="text-sm text-gray-500 max-w-sm mx-auto p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm italic mt-8 border border-gray-100 dark:border-gray-700">
                                    "XIRR represents the annualized percentage rate of return for a series of irregular cash flows."
                                </p>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Activity size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter at least one negative and one positive flow to estimate XIRR.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
