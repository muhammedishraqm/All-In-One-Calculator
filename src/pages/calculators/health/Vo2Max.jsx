import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { HeartPulse } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function Vo2Max() {
    const { addCalculation } = useHistoryContext();
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [heartRate, setHeartRate] = useState('');
    const [timeInMins, setTimeInMins] = useState('');
    
    // Rockport 1-mile walking test formula
    const result = useMemo(() => {
        if (!age || !heartRate || !timeInMins) return null;
        
        const a = parseFloat(age);
        const hr = parseFloat(heartRate);
        const t = parseFloat(timeInMins);
        const g = gender === 'male' ? 1 : 0;
        const w = 70; // Assumed weight 70kg / 154lbs for simple Rockport without weight

        if (isNaN(a) || isNaN(hr) || isNaN(t)) return { error: 'Invalid numbers' };

        // Rockport formula roughly (using a fixed 154 lbs weight for simplicity if weight not provided):
        // VO2 Max = 132.853 - (0.0769 × Weight in lbs) - (0.3877 × Age) + (6.315 × Gender) - (3.2649 × Time in minutes) - (0.1565 × Heart Rate)
        const vo2 = 132.853 - (0.0769 * 154) - (0.3877 * a) + (6.315 * g) - (3.2649 * t) - (0.1565 * hr);

        let rating = 'Poor';
        if (vo2 > 50) rating = 'Excellent';
        else if (vo2 > 40) rating = 'Good';
        else if (vo2 > 30) rating = 'Average';

        return { val: Math.max(0, vo2), rating };
    }, [age, gender, heartRate, timeInMins]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'VO2 Max (Rockport)',
             details: `HR: ${heartRate}, ${timeInMins}m`,
             result: `${result.val.toFixed(1)} ml/kg/min`,
             category: 'HeartPulse'
        });
    }

    return (
        <CalculatorLayout
            title="VO2 Max Estimator"
            description="Estimate cardiovascular fitness using the Rockport 1-mile walk test."
            icon={HeartPulse}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="card p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Age</label>
                             <input type="number" value={age} onChange={(e) => setAge(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="e.g. 30" />
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sex</label>
                             <select value={gender} onChange={(e) => {setGender(e.target.value); handleLog()}} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                             </select>
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Completion Time (1-mile walk)</label>
                         <input type="number" value={timeInMins} onChange={(e) => setTimeInMins(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="Minutes, e.g. 15.5" step="0.1" />
                    </div>

                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Heart Rate (End of walk)</label>
                         <input type="number" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="BPM, e.g. 130" />
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-rose-50 to-white dark:from-rose-900/20 dark:to-surface-dark border-rose-100 dark:border-rose-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-4">
                                <p className="text-sm font-bold tracking-wider text-rose-500 dark:text-rose-400 uppercase">Estimated VO2 Max</p>
                                <h2 className="text-6xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                                    {result.val.toFixed(1)}
                                </h2>
                                <p className="text-lg font-bold text-gray-500 dark:text-gray-400">ml/kg/min</p>

                                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                     <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Fitness Rating</p>
                                     <p className={`text-2xl font-bold uppercase tracking-widest ${result.rating === 'Excellent' || result.rating === 'Good' ? 'text-green-500' : 'text-orange-500'}`}>
                                         {result.rating}
                                     </p>
                                </div>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <HeartPulse size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter Rockport walk test data.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
