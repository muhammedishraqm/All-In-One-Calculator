import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Flame } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function BMRCalculator() {
    const { addCalculation } = useHistoryContext();
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');

    const result = useMemo(() => {
        if (!age || !weight || !height) return null;
        
        const a = parseFloat(age);
        const w = parseFloat(weight);
        const h = parseFloat(height);
        
        if (isNaN(a) || isNaN(w) || isNaN(h)) return { error: 'Please enter valid numbers' };

        // Mifflin-St Jeor Equation for BMR
        // This is considered the most accurate modern formula
        let bmr = (10 * w) + (6.25 * h) - (5 * a);
        bmr += gender === 'male' ? 5 : -161;

        // Revised Harris-Benedict Equation for comparison
        let hb = 0;
        if (gender === 'male') {
             hb = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
        } else {
             hb = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
        }

        return {
            mifflin: Math.round(bmr),
            harris: Math.round(hb)
        };
    }, [gender, age, weight, height]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'BMR Estimator',
             details: `${weight}kg, ${age}yrs, ${gender}`,
             result: `${result.mifflin} kcal/day`,
             category: 'Flame'
        });
    }

    return (
        <CalculatorLayout
            title="BMR Calculator"
            description="Calculate your Basal Metabolic Rate using the Mifflin-St Jeor formula."
            icon={Flame}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                             <input type="number" min="1" value={age} onChange={(e) => setAge(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" />
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
                </div>

                <div className="card p-6 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-surface-dark border-orange-100 dark:border-orange-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-6">
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                                     <Flame className="absolute right-0 bottom-0 p-4 opacity-5 pointer-events-none text-orange-500 w-48 h-48" />
                                     <p className="text-sm font-bold tracking-wider text-orange-500 dark:text-orange-400 uppercase mb-2">Mifflin-St Jeor (Modern)</p>
                                     <h2 className="text-6xl font-black text-orange-600 dark:text-orange-400 tracking-tight leading-tight">
                                         {result.mifflin}
                                     </h2>
                                     <p className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase">kcal / day</p>
                                     <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-4 leading-relaxed max-w-sm mx-auto">This is the baseline energy required to keep your body functioning at complete rest.</p>
                                </div>
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden text-left flex justify-between items-center">
                                     <div>
                                        <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-1">Harris-Benedict (Revised)</p>
                                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-relaxed max-w-[200px]">An older, alternative medical formula for BMR.</p>
                                     </div>
                                     <h2 className="text-3xl font-black text-gray-800 dark:text-gray-200 tracking-tight leading-tight">
                                         {result.harris} <span className="text-sm text-gray-500 block uppercase pt-2">kcal</span>
                                     </h2>
                                </div>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Flame size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter body specifics to approximate BMR.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
