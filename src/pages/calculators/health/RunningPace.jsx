import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Timer } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function RunningPace() {
    const { addCalculation } = useHistoryContext();
    const [distanceKm, setDistanceKm] = useState('');
    const [timeH, setTimeH] = useState('0');
    const [timeM, setTimeM] = useState('');
    const [timeS, setTimeS] = useState('0');

    const result = useMemo(() => {
        if (!distanceKm) return null;
        const d = parseFloat(distanceKm);
        const h = parseInt(timeH) || 0;
        const m = parseInt(timeM) || 0;
        const s = parseInt(timeS) || 0;

        if (isNaN(d) || d <= 0) return { error: 'Invalid distance' };
        
        const totalMinutes = (h * 60) + m + (s / 60);
        if (totalMinutes <= 0) return { error: 'Invalid time' };

        const paceMinKm = totalMinutes / d;
        const paceMin = Math.floor(paceMinKm);
        const paceSec = Math.round((paceMinKm - paceMin) * 60);

        // mph/kmh
        const kmh = d / (totalMinutes / 60);

        return {
            paceStr: `${paceMin}:${paceSec.toString().padStart(2, '0')} /km`,
            speedStr: `${kmh.toFixed(2)} km/h`
        };
    }, [distanceKm, timeH, timeM, timeS]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'Running Pace',
             details: `${distanceKm}km in ${timeH}h ${timeM}m`,
             result: result.paceStr,
             category: 'Timer'
        });
    }

    const setRace = (km) => {
        setDistanceKm(km.toString());
        handleLog();
    }

    return (
        <CalculatorLayout
            title="Running Pace Calculator"
            description="Calculate your running speed and pace per kilometer."
            icon={Timer}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="card p-6 space-y-6">
                    <div>
                         <div className="flex justify-between items-center mb-2">
                             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Distance (Kilometers)</label>
                         </div>
                         <input type="number" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="e.g. 5" step="0.1" />
                         
                         <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                             <button onClick={() => setRace(5)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold rounded-lg whitespace-nowrap">5K</button>
                             <button onClick={() => setRace(10)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold rounded-lg whitespace-nowrap">10K</button>
                             <button onClick={() => setRace(21.0975)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold rounded-lg whitespace-nowrap">Half Marathon</button>
                             <button onClick={() => setRace(42.195)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold rounded-lg whitespace-nowrap">Marathon</button>
                         </div>
                    </div>

                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Completion Time</label>
                         <div className="grid grid-cols-3 gap-2">
                             <div className="relative">
                                 <input type="number" min="0" value={timeH} onChange={(e) => setTimeH(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="HH" />
                                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">H</span>
                             </div>
                             <div className="relative">
                                 <input type="number" min="0" max="59" value={timeM} onChange={(e) => setTimeM(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="MM" />
                                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">M</span>
                             </div>
                             <div className="relative">
                                 <input type="number" min="0" max="59" value={timeS} onChange={(e) => setTimeS(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="SS" />
                                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">S</span>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-surface-dark border-yellow-100 dark:border-yellow-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="text-center w-full space-y-4">
                                <p className="text-sm font-bold tracking-wider text-yellow-500 dark:text-yellow-400 uppercase">Average Pace</p>
                                <h2 className="text-6xl font-black text-yellow-600 dark:text-yellow-400 tracking-tight">
                                    {result.paceStr.split(' ')[0]}
                                </h2>
                                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">/ km</p>

                                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                     <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Average Speed</p>
                                     <p className={`text-2xl font-bold uppercase tracking-widest text-gray-900 dark:text-white`}>
                                         {result.speedStr}
                                     </p>
                                </div>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Timer size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter distance and time to see pace.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
