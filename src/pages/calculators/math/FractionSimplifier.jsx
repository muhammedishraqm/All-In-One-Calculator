import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { PieChart, Divide } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function FractionSimplifier() {
    const { addCalculation } = useHistoryContext();
    const [numerator, setNumerator] = useState('');
    const [denominator, setDenominator] = useState('');

    const gcd = (a, b) => {
        return b === 0 ? a : gcd(b, a % b);
    };

    const result = useMemo(() => {
        if (!numerator || !denominator) return null;
        let num = parseInt(numerator);
        let den = parseInt(denominator);

        if (isNaN(num) || isNaN(den) || den === 0) return { error: 'Invalid fraction' };

        const divisor = Math.abs(gcd(num, den));
        const simpleNum = num / divisor;
        const simpleDen = den / divisor;

        // Decimal form
        const decimal = num / den;

        return {
            original: `${num}/${den}`,
            simplified: `${simpleNum}/${simpleDen}`,
            decimal: decimal.toString(),
            isSimplified: num === simpleNum && den === simpleDen
        };
    }, [numerator, denominator]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'Fraction Simplifier',
             details: `Simplified ${result.original}`,
             result: result.simplified,
             category: 'PieChart'
        });
    }

    return (
        <CalculatorLayout
            title="Fraction Simplifier"
            description="Reduce fractions to their simplest mathematical terms."
            icon={PieChart}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 flex flex-col items-center justify-center space-y-6">
                    <img src="https://api.iconify.design/lucide:pie-chart.svg?color=%23d1d5db" alt="Bg" className="w-32 h-32 absolute opacity-5 pointer-events-none" />

                    <div className="flex flex-col items-center space-y-4 w-full max-w-[200px] z-10">
                         <input
                             type="number"
                             value={numerator}
                             onChange={(e) => setNumerator(e.target.value)}
                             onBlur={handleLog}
                             placeholder="Numerator"
                             className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-bold text-center text-xl shadow-sm"
                         />
                         
                         <div className="w-full h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>

                         <input
                             type="number"
                             value={denominator}
                             onChange={(e) => setDenominator(e.target.value)}
                             onBlur={handleLog}
                             placeholder="Denominator"
                             className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-bold text-center text-xl shadow-sm"
                         />
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-surface-dark border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-6">
                                <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Simplified Form</p>
                                
                                <div className="inline-flex flex-col items-center text-indigo-600 dark:text-indigo-400 font-black">
                                    <span className="text-6xl">{result.simplified.split('/')[0]}</span>
                                    {result.simplified.includes('/') && <div className="w-full h-2 bg-indigo-600 dark:bg-indigo-400 my-2 rounded-full"></div>}
                                    {result.simplified.includes('/') && <span className="text-6xl">{result.simplified.split('/')[1]}</span>}
                                </div>
                                
                                {result.isSimplified && (
                                    <p className="text-indigo-500/70 dark:text-indigo-400/70 text-sm font-semibold mt-4">Fraction is already in simplest form.</p>
                                )}

                                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Decimal Form</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">
                                        {result.decimal}
                                    </p>
                                </div>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Divide size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter numerator and denominator to simplify.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
