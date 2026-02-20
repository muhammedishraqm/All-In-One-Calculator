import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Target } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function IdealWeight() {
    const { addCalculation } = useHistoryContext();
    const [gender, setGender] = useState('male');
    const [heightCm, setHeightCm] = useState('');

    const result = useMemo(() => {
        if (!heightCm) return null;
        const h = parseFloat(heightCm);
        if (isNaN(h) || h < 100 || h > 250) return { error: 'Enter a valid height (100-250cm)' };

        const inchesOver5Ft = (h / 2.54) - 60;
        
        // Devine Formula
        let devine = 0;
        // Robinson Formula  
        let robinson = 0;
        // Miller Formula
        let miller = 0;

        if (gender === 'male') {
            devine = 50 + (2.3 * inchesOver5Ft);
            robinson = 52 + (1.9 * inchesOver5Ft);
            miller = 56.2 + (1.41 * inchesOver5Ft);
        } else {
            devine = 45.5 + (2.3 * inchesOver5Ft);
            robinson = 49 + (1.7 * inchesOver5Ft);
            miller = 53.1 + (1.36 * inchesOver5Ft);
        }

        // BMI range based (18.5 - 24.9)
        const heightM = h / 100;
        const minBMIWeight = 18.5 * (heightM * heightM);
        const maxBMIWeight = 24.9 * (heightM * heightM);

        return {
            avgIdeal: ((devine + robinson + miller) / 3).toFixed(1),
            devine: devine.toFixed(1),
            robinson: robinson.toFixed(1),
            miller: miller.toFixed(1),
            bmiRange: `${minBMIWeight.toFixed(1)} - ${maxBMIWeight.toFixed(1)}`
        };
    }, [gender, heightCm]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'Ideal Weight',
             details: `${heightCm}cm, ${gender}`,
             result: `${result.avgIdeal} kg`,
             category: 'Target'
        });
    }

    return (
        <CalculatorLayout
            title="Ideal Weight Calculator"
            description="Find your target weight using universally recognized medical formulas."
            icon={Target}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="card p-6 space-y-6">
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Biological Sex</label>
                         <select value={gender} onChange={(e) => {setGender(e.target.value); handleLog()}} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                         </select>
                    </div>

                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Height (in cm)</label>
                         <input type="number" min="100" max="250" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="e.g. 175" />
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-surface-dark border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-4">
                                <p className="text-sm font-bold tracking-wider text-indigo-500 dark:text-indigo-400 uppercase">Average Ideal</p>
                                <h2 className="text-6xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight leading-tight">
                                    {result.avgIdeal}
                                </h2>
                                <p className="text-lg font-bold text-gray-500 dark:text-gray-400">kg</p>

                                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full space-y-2 text-sm text-left">
                                     <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                                         <span className="text-gray-500 font-medium">Devine Formula</span>
                                         <span className="font-bold">{result.devine} kg</span>
                                     </div>
                                     <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                                         <span className="text-gray-500 font-medium">Robinson Formula</span>
                                         <span className="font-bold">{result.robinson} kg</span>
                                     </div>
                                     <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                                         <span className="text-gray-500 font-medium">Miller Formula</span>
                                         <span className="font-bold">{result.miller} kg</span>
                                     </div>
                                     <div className="flex justify-between pt-2">
                                         <span className="text-gray-500 font-medium flex items-center gap-1">Healthy BMI Range</span>
                                         <span className="font-black text-indigo-500">{result.bmiRange} kg</span>
                                     </div>
                                </div>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Target size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter details to see ideal target weight.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
