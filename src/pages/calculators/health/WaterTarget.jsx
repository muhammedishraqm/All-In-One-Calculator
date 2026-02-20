import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Droplets } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function WaterTarget() {
    const { addCalculation } = useHistoryContext();
    const [weightKg, setWeightKg] = useState('');
    const [activityMins, setActivityMins] = useState(30);

    const result = useMemo(() => {
        if (!weightKg) return null;
        const w = parseFloat(weightKg);
        if (isNaN(w) || w <= 0) return { error: 'Invalid weight' };

        // Simple formula: Weight in kg * 35ml + (Mins / 30 * 350ml)
        const baseMl = w * 35;
        const activityMl = (activityMins / 30) * 350;
        const totalLiters = (baseMl + activityMl) / 1000;

        return {
            liters: totalLiters.toFixed(2),
            glasses: Math.round((totalLiters * 1000) / 250) // Assuming 250ml per glass
        };
    }, [weightKg, activityMins]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'Water Target',
             details: `${weightKg}kg, ${activityMins}m activity`,
             result: `${result.liters}L / day`,
             category: 'Droplets'
        });
    }

    return (
        <CalculatorLayout
            title="Daily Water Intake"
            description="Calculate your recommended daily hydration based on weight and activity."
            icon={Droplets}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="card p-6 space-y-6">
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
                         <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="e.g. 75" />
                    </div>

                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex justify-between">
                             <span>Daily Activity (Minutes)</span>
                             <span className="text-cyan-500">{activityMins} Min</span>
                         </label>
                         <input type="range" min="0" max="180" step="15" value={activityMins} onChange={(e) => setActivityMins(Number(e.target.value))} onMouseUp={handleLog} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-cyan-500" />
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-900/20 dark:to-surface-dark border-cyan-100 dark:border-cyan-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-6">
                                <p className="text-sm font-bold tracking-wider text-cyan-500 dark:text-cyan-400 uppercase">Target Intake</p>
                                <h2 className="text-6xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight leading-tight">
                                    {result.liters} L
                                </h2>

                                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                     <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Approximately</p>
                                     <p className={`text-3xl font-bold uppercase tracking-widest text-gray-900 dark:text-white flex items-center justify-center gap-2`}>
                                         <Droplets size={24} className="text-cyan-400" /> {result.glasses} Glasses
                                     </p>
                                </div>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Droplets size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter details to see daily hydration target.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
