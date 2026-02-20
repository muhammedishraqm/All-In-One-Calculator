import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Activity } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function BodyFat() {
    const { addCalculation } = useHistoryContext();
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [neck, setNeck] = useState('');
    const [waist, setWaist] = useState('');
    const [hip, setHip] = useState('');

    const result = useMemo(() => {
        if (!height || !neck || !waist || (gender === 'female' && !hip)) return null;

        const h = parseFloat(height);
        const w = parseFloat(weight);
        const n = parseFloat(neck);
        const wa = parseFloat(waist);
        const a = parseFloat(age);
        const hp = gender === 'female' ? parseFloat(hip) : 0;

        if (isNaN(h) || isNaN(n) || isNaN(wa) || isNaN(w) || isNaN(a) || (gender === 'female' && isNaN(hp))) return { error: 'Please fill all applicable fields' };
        if (h <= n || wa <= n) return { error: 'Measurements geometrically unlikely' };

        // US Navy Method (metric formulas)
        let bodyFatPercent = 0;
        
        if (gender === 'male') {
            bodyFatPercent = 495 / (1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h)) - 450;
        } else {
            bodyFatPercent = 495 / (1.29579 - 0.35004 * Math.log10(wa + hp - n) + 0.22100 * Math.log10(h)) - 450;
        }

        const leanMass = w - (w * (bodyFatPercent / 100));

        // Category determination (approximate)
        let category = 'Average';
        let color = 'text-yellow-500';

        if (gender === 'male') {
             if (bodyFatPercent < 6) { category = 'Essential Fat'; color = 'text-cyan-500'; }
             else if (bodyFatPercent <= 13) { category = 'Athletic'; color = 'text-green-500'; }
             else if (bodyFatPercent <= 17) { category = 'Fitness'; color = 'text-emerald-500'; }
             else if (bodyFatPercent <= 24) { category = 'Average'; color = 'text-yellow-500'; }
             else { category = 'Obese'; color = 'text-red-500'; }
        } else {
             if (bodyFatPercent < 14) { category = 'Essential Fat'; color = 'text-cyan-500'; }
             else if (bodyFatPercent <= 20) { category = 'Athletic'; color = 'text-green-500'; }
             else if (bodyFatPercent <= 24) { category = 'Fitness'; color = 'text-emerald-500'; }
             else if (bodyFatPercent <= 31) { category = 'Average'; color = 'text-yellow-500'; }
             else { category = 'Obese'; color = 'text-red-500'; }
        }

        return {
            percent: Math.max(0, Math.min(100, bodyFatPercent)).toFixed(1),
            leanMass: leanMass.toFixed(1),
            fatMass: (w - leanMass).toFixed(1),
            category,
            color
        };

    }, [gender, height, neck, waist, hip, weight, age]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'Body Fat %',
             details: `${weight}kg, ${height}cm, ${gender}`,
             result: `${result.percent}%`,
             category: 'Activity'
        });
    }

    return (
        <CalculatorLayout
            title="Body Fat Estimator"
            description="US Navy method body fat estimation using circumferences."
            icon={Activity}
        >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Biological Sex</label>
                             <select value={gender} onChange={(e) => {setGender(e.target.value); handleLog()}} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                             </select>
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Age</label>
                             <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
                             <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" />
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Height (cm)</label>
                             <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                         <h3 className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Circumference Measurements (cm)</h3>
                         <div className="grid grid-cols-1 gap-4">
                             <div>
                                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Neck (Below larynx)</label>
                                 <input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" />
                             </div>
                             <div>
                                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Waist (At navel button)</label>
                                 <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" />
                             </div>
                             {gender === 'female' && (
                                 <div>
                                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Hip (Widest point)</label>
                                     <input type="number" value={hip} onChange={(e) => setHip(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" />
                                 </div>
                             )}
                         </div>
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-surface-dark border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold text-center">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-6">
                                <p className="text-sm font-bold tracking-wider text-indigo-500 dark:text-indigo-400 uppercase">Estimated Body Fat</p>
                                <div className="flex flex-col items-center">
                                    <h2 className="text-6xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight leading-tight">
                                        {result.percent}%
                                    </h2>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold bg-white dark:bg-gray-800 mt-4 border border-gray-100 dark:border-gray-700 ${result.color}`}>
                                        {result.category}
                                    </span>
                                </div>

                                <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full">
                                     <div className="grid grid-cols-2 gap-4 divide-x divide-gray-100 dark:divide-gray-700">
                                         <div>
                                             <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Fat Mass</p>
                                             <p className="font-bold text-xl">{result.fatMass} kg</p>
                                         </div>
                                         <div>
                                             <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Lean Mass</p>
                                             <p className="font-bold text-xl">{result.leanMass} kg</p>
                                         </div>
                                     </div>
                                </div>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Activity size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter body measurements to approximate body fat percentage.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
