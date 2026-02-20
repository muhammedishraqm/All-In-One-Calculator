import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Apple } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function CalorieIntake() {
    const { addCalculation } = useHistoryContext();
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [activityLevel, setActivityLevel] = useState('1.2');

    const ACTIVITY_MULTIPLIERS = {
        '1.2': 'Sedentary (Little to no exercise)',
        '1.375': 'Light Activity (1-3 days/week)',
        '1.55': 'Moderate Activity (3-5 days/week)',
        '1.725': 'Active (6-7 days/week)',
        '1.9': 'Very Active (Physical job + training)'
    };

    const result = useMemo(() => {
        if (!age || !weight || !height) return null;
        
        const a = parseFloat(age);
        const w = parseFloat(weight);
        const h = parseFloat(height);
        
        if (isNaN(a) || isNaN(w) || isNaN(h)) return { error: 'Please enter valid numbers' };

        // Mifflin-St Jeor Equation for BMR
        let bmr = (10 * w) + (6.25 * h) - (5 * a);
        bmr += gender === 'male' ? 5 : -161;

        const tdee = bmr * parseFloat(activityLevel);

        return {
            maintain: Math.round(tdee),
            mildWeightLoss: Math.round(tdee - 250),
            weightLoss: Math.round(tdee - 500),
            extremeWeightLoss: Math.round(tdee - 1000),
            mildWeightGain: Math.round(tdee + 250),
            weightGain: Math.round(tdee + 500)
        };
    }, [gender, age, weight, height, activityLevel]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'Calorie Needs (TDEE)',
             details: `${weight}kg, ${height}cm, Level ${activityLevel}`,
             result: `${result.maintain} kcal`,
             category: 'Apple'
        });
    }

    return (
        <CalculatorLayout
            title="Daily Calorie Needs"
            description="Estimate total daily energy expenditure (TDEE) based on activity."
            icon={Apple}
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

                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Activity Level</label>
                         <select value={activityLevel} onChange={(e) => {setActivityLevel(e.target.value); handleLog()}} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none">
                             {Object.entries(ACTIVITY_MULTIPLIERS).map(([val, label]) => (
                                 <option key={val} value={val}>{label}</option>
                             ))}
                         </select>
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-surface-dark border-green-100 dark:border-green-900/50 flex flex-col justify-center space-y-6 overflow-y-auto max-h-[500px]">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold text-center">{result.error}</div>
                         ) : (
                            <div className="w-full space-y-4">
                                <div className="text-center w-full mb-6 relative">
                                    <Apple className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none text-green-500 w-32 h-32" />
                                    <p className="text-sm font-bold tracking-wider text-green-600 dark:text-green-500 uppercase mb-2">Maintain Weight</p>
                                    <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                                        {result.maintain} <span className="text-lg text-gray-500 font-bold uppercase">kcal/day</span>
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-gray-100">Mild Weight Loss</p>
                                            <p className="text-xs text-gray-500 font-medium">0.25 kg/week</p>
                                        </div>
                                        <p className="text-xl font-black text-red-500">{result.mildWeightLoss}</p>
                                    </div>
                                    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-gray-100">Weight Loss</p>
                                            <p className="text-xs text-gray-500 font-medium">0.5 kg/week</p>
                                        </div>
                                        <p className="text-xl font-black text-red-500">{result.weightLoss}</p>
                                    </div>
                                    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-gray-100">Extreme Weight Loss</p>
                                            <p className="text-xs text-gray-500 font-medium">1 kg/week</p>
                                        </div>
                                        <p className="text-xl font-black text-red-600">{result.extremeWeightLoss}</p>
                                    </div>
                                    
                                    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mt-4">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-gray-100">Mild Weight Gain</p>
                                            <p className="text-xs text-gray-500 font-medium">+0.25 kg/week</p>
                                        </div>
                                        <p className="text-xl font-black text-green-600">{result.mildWeightGain}</p>
                                    </div>
                                    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-gray-100">Weight Gain</p>
                                            <p className="text-xs text-gray-500 font-medium">+0.5 kg/week</p>
                                        </div>
                                        <p className="text-xl font-black text-green-600">{result.weightGain}</p>
                                    </div>
                                </div>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Apple size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter details to see daily calorie targets.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
