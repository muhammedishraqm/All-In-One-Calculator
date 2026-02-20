import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { TrendingUp, Coins } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function InflationAdjustedReturns() {
    const { addCalculation } = useHistoryContext();
    const [nominalReturn, setNominalReturn] = useState('');
    const [inflationRate, setInflationRate] = useState('');

    const result = useMemo(() => {
        if (!nominalReturn || !inflationRate) return null;
        const nom = parseFloat(nominalReturn);
        const inf = parseFloat(inflationRate);

        if (isNaN(nom) || isNaN(inf)) return { error: 'Invalid rates' };

        // Fisher Equation logic (exact)
        // (1 + nominal) = (1 + real) * (1 + inflation)
        // real = ((1 + nominal) / (1 + inflation)) - 1
        
        const realReturn = (((1 + nom / 100) / (1 + inf / 100)) - 1) * 100;
        
        return {
            realRates: realReturn.toFixed(2),
            nomRate: nom.toFixed(2),
            infRate: inf.toFixed(2)
        };
    }, [nominalReturn, inflationRate]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'Inflation Adjusted Return',
             details: `${nominalReturn}% nom, ${inflationRate}% inf`,
             result: `${result.realRates}% real`,
             category: 'TrendingUp'
        });
    }

    return (
        <CalculatorLayout
            title="Inflation Adjusted Returns"
            description="Calculate the true purchasing power of your investment returns."
            icon={TrendingUp}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="card p-6 space-y-6">
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nominal Rate of Return (%)</label>
                         <input type="number" step="0.1" value={nominalReturn} onChange={(e) => setNominalReturn(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="e.g. 10" />
                    </div>

                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Inflation Rate (%)</label>
                         <input type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="e.g. 3.5" />
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-surface-dark border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-center items-center space-y-6 relative overflow-hidden">
                    <TrendingUp className="absolute top-0 right-0 p-8 w-64 h-64 text-indigo-500 opacity-5 pointer-events-none" />
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-4 relative z-10">
                                <p className="text-sm font-bold tracking-wider text-indigo-500 dark:text-indigo-400 uppercase bg-indigo-100 dark:bg-indigo-900/40 inline-block px-4 py-1.5 rounded-full mb-4">Real Rate of Return</p>
                                <h2 className={`text-6xl font-black tracking-tight leading-tight flex items-center justify-center gap-2 ${result.realRates > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {result.realRates}%
                                </h2>

                                <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-sm mx-auto text-left">
                                     <div className="flex items-start gap-4 mb-2">
                                         <Coins className="text-gray-400 mt-1" size={20} />
                                         <div>
                                            <p className="text-sm text-gray-500">Nominal return says you gained <span className="font-bold text-gray-900 dark:text-white">{result.nomRate}%</span></p>
                                         </div>
                                     </div>
                                     <div className="flex items-start gap-4">
                                         <Coins className="text-gray-400 mt-1" size={20} />
                                         <div>
                                            <p className="text-sm text-gray-500">BUT inflation ate <span className="font-bold text-red-500">{result.infRate}%</span>, leaving a true purchasing power increase of <span className={`font-bold ${result.realRates > 0 ? 'text-indigo-500' : 'text-red-500'}`}>{result.realRates}%</span></p>
                                         </div>
                                     </div>
                                </div>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <TrendingUp size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter returns and inflation to see real impact.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
