import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Divide, MoveDown, MoveUp } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function GcdLcm() {
    const { addCalculation } = useHistoryContext();
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');

    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const lcm = (a, b) => (a * b) / gcd(a, b);

    const result = useMemo(() => {
        if (!num1 || !num2) return null;
        const n1 = parseInt(num1);
        const n2 = parseInt(num2);

        if (isNaN(n1) || isNaN(n2) || n1 <= 0 || n2 <= 0) return { error: 'Enter positive integers' };

        const divisor = gcd(n1, n2);
        const multiple = lcm(n1, n2);

        return { gcd: divisor, lcm: multiple };
    }, [num1, num2]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'GCD / LCM',
             details: `For ${num1} and ${num2}`,
             result: `GCD: ${result.gcd}`,
             category: 'Divide'
        });
    }

    return (
        <CalculatorLayout
            title="GCD & LCM Calculator"
            description="Find Greatest Common Divisor and Least Common Multiple."
            icon={Divide}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                             Number 1
                         </label>
                         <input
                             type="number"
                             min="1"
                             value={num1}
                             onChange={(e) => setNum1(e.target.value)}
                             onBlur={handleLog}
                             placeholder="e.g. 12"
                             className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium shadow-sm font-mono"
                         />
                    </div>
                     <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                             Number 2
                         </label>
                         <input
                             type="number"
                             min="1"
                             value={num2}
                             onChange={(e) => setNum2(e.target.value)}
                             onBlur={handleLog}
                             placeholder="e.g. 18"
                             className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium shadow-sm font-mono"
                         />
                     </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-surface-dark border-blue-100 dark:border-blue-900/50 flex flex-col justify-center items-center space-y-8 relative overflow-hidden">
                    <Divide className="absolute right-0 bottom-0 p-8 opacity-5 w-64 h-64 text-blue-500 pointer-events-none" />
                    
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="w-full space-y-6 flex flex-col items-center">
                                
                                <div className="text-center w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-center mb-2"><MoveDown className="text-blue-500" /></div>
                                    <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Greatest Factor (GCD)</p>
                                    <h2 className="text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                                        {result.gcd}
                                    </h2>
                                </div>
                                
                                <div className="text-center w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-center mb-2"><MoveUp className="text-cyan-500" /></div>
                                    <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Least Multiple (LCM)</p>
                                    <h2 className="text-4xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight break-all">
                                        {result.lcm}
                                    </h2>
                                </div>

                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Divide size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter two integers to evaluate.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
