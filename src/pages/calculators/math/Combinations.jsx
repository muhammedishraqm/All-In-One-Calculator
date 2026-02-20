import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Hash, Layers } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function Combinations() {
    const { addCalculation } = useHistoryContext();
    const [n, setN] = useState('');
    const [r, setR] = useState('');

    const fact = (num) => {
        if (num < 0) return 0;
        let p = 1n; // Use BigInt for massive numbers
        for (let i = 2n; i <= BigInt(num); i++) {
            p *= i;
        }
        return p;
    };

    const result = useMemo(() => {
        if (!n || !r) return null;
        let nVal = parseInt(n);
        let rVal = parseInt(r);

        if (isNaN(nVal) || isNaN(rVal) || nVal < 0 || rVal < 0) return { error: 'Must be positive integers' };
        if (rVal > nVal) return { error: 'r cannot be greater than n' };

        try {
            const numFact = fact(nVal);
            const rFact = fact(rVal);
            const nMinusRFact = fact(nVal - rVal);

            const nCr = numFact / (rFact * nMinusRFact);
            const nPr = numFact / nMinusRFact;

            return {
                comb: nCr.toString(),
                perm: nPr.toString(),
            };
        } catch (e) {
            return { error: 'Numbers too large to calculate directly' };
        }
    }, [n, r]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'Combinations (nCr)',
             details: `${n} items, choosing ${r}`,
             result: `${result.comb} sets`,
             category: 'Hash'
        });
    }

    return (
        <CalculatorLayout
            title="Combinations (nCr)"
            description="Calculate selection combinations and permutations."
            icon={Hash}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                             Total Number of Items (n)
                         </label>
                         <input
                             type="number"
                             min="0"
                             value={n}
                             onChange={(e) => setN(e.target.value)}
                             onBlur={handleLog}
                             placeholder="e.g. 10"
                             className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium font-mono"
                         />
                    </div>
                     <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                             Number of Items to Select (r)
                         </label>
                         <input
                             type="number"
                             min="0"
                             value={r}
                             onChange={(e) => setR(e.target.value)}
                             onBlur={handleLog}
                             placeholder="e.g. 3"
                             className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium font-mono shadow-sm"
                         />
                     </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-surface-dark border-purple-100 dark:border-purple-900/50 flex flex-col justify-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold text-center">{result.error}</div>
                         ) : (
                            <div className="space-y-4">
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                         <Hash size={120} />
                                     </div>
                                     <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2 relative z-10">Combinations (nCr)</p>
                                     <h2 className="text-4xl lg:text-5xl font-black text-purple-600 dark:text-purple-400 tracking-tight break-all relative z-10">
                                         {result.comb}
                                     </h2>
                                     <p className="text-xs text-gray-500 mt-2 relative z-10 font-medium">(Order does not matter)</p>
                                </div>
                                
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <Layers size={120} />
                                    </div>
                                    <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2 relative z-10">Permutations (nPr)</p>
                                    <h2 className="text-2xl lg:text-3xl font-black text-pink-600 dark:text-pink-400 tracking-tight break-all relative z-10 line-clamp-2" title={result.perm}>
                                        {result.perm}
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-2 relative z-10 font-medium">(Order matters)</p>
                                </div>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Hash size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter n and r to calculate sets.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
