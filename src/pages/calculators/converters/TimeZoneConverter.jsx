import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Globe, Clock, ArrowRight } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

const ZONES = [
  { id: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: 0 },
  { id: 'EST', label: 'EST (New York, Toronto)', offset: -5 },
  { id: 'CST', label: 'CST (Chicago, Mexico City)', offset: -6 },
  { id: 'MST', label: 'MST (Denver, Phoenix)', offset: -7 },
  { id: 'PST', label: 'PST (Los Angeles, Vancouver)', offset: -8 },
  { id: 'GMT', label: 'GMT (London)', offset: 0 },
  { id: 'CET', label: 'CET (Paris, Berlin, Rome)', offset: 1 },
  { id: 'EET', label: 'EET (Athens, Cairo)', offset: 2 },
  { id: 'MSK', label: 'MSK (Moscow)', offset: 3 },
  { id: 'GST', label: 'GST (Dubai)', offset: 4 },
  { id: 'IST', label: 'IST (India)', offset: 5.5 },
  { id: 'ICT', label: 'ICT (Bangkok, Hanoi)', offset: 7 },
  { id: 'CST_CN', label: 'CST (Beijing, Singapore)', offset: 8 },
  { id: 'JST', label: 'JST (Tokyo, Seoul)', offset: 9 },
  { id: 'AEST', label: 'AEST (Sydney, Melbourne)', offset: 10 },
  { id: 'NZST', label: 'NZST (Auckland)', offset: 12 },
];

export default function TimeZoneConverter() {
    const { addCalculation } = useHistoryContext();
    const [sourceTime, setSourceTime] = useState('12:00');
    const [sourceZone, setSourceZone] = useState('GMT');
    const [targetZone, setTargetZone] = useState('IST');

    const result = useMemo(() => {
        if (!sourceTime) return null;

        const [h, m] = sourceTime.split(':').map(Number);
        
        const srcOff = ZONES.find(z => z.id === sourceZone)?.offset || 0;
        const tgtOff = ZONES.find(z => z.id === targetZone)?.offset || 0;

        const diff = tgtOff - srcOff;

        // Create dummy date today at source hours
        let date = new Date(2000, 0, 1, h, m);
        
        // Add diff in hours
        const diffInt = Math.floor(diff);
        const diffMin = (diff - diffInt) * 60;

        date.setHours(date.getHours() + diffInt);
        date.setMinutes(date.getMinutes() + diffMin);

        const outH = String(date.getHours()).padStart(2, '0');
        const outM = String(date.getMinutes()).padStart(2, '0');

        let dayString = '';
        if(date.getDate() > 1) dayString = '+1 Day (Tomorrow)';
        if(date.getDate() < 1) dayString = '-1 Day (Yesterday)';

        return { time: `${outH}:${outM}`, dayOff: dayString };
    }, [sourceTime, sourceZone, targetZone]);

    const handleCalculate = () => {
        if (!result) return;
        addCalculation({
             title: 'Time Zone Conversion',
             details: `${sourceTime} ${sourceZone} ➔ ${targetZone}`,
             result: `${result.time} ${result.dayOff}`,
             category: 'Globe'
        });
    };

    return (
        <CalculatorLayout
            title="Time Zones"
            description="Quickly convert times across different global zones."
            icon={Globe}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Source Time
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="time"
                                required
                                value={sourceTime}
                                onChange={(e) => setSourceTime(e.target.value)}
                                onBlur={handleCalculate}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4 relative">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 px-2">
                                From Zone
                            </label>
                            <select
                                value={sourceZone}
                                onChange={(e) => { setSourceZone(e.target.value); handleCalculate(); }}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium shadow-sm"
                            >
                                {ZONES.map(z => <option key={z.id} value={z.id}>{z.label}</option>)}
                            </select>
                        </div>
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 z-10 hidden sm:block">
                            <ArrowRight size={20} className="text-primary-500" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 px-2">
                                To Zone
                            </label>
                            <select
                                value={targetZone}
                                onChange={(e) => { setTargetZone(e.target.value); handleCalculate(); }}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium shadow-sm"
                            >
                                {ZONES.map(z => <option key={z.id} value={z.id}>{z.label}</option>)}
                            </select>
                        </div>
                    </div>

                </div>

                <div className="card p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-surface-dark border-blue-100 dark:border-blue-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         <div className="text-center p-10 bg-white dark:bg-surface-light rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full animate-fade-in relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none -mt-4 -mr-4">
                               <Globe size={180} />
                            </div>
                            <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4 relative z-10">Time in {targetZone}</p>
                            <h2 className="text-6xl font-black text-blue-600 dark:text-blue-400 tracking-tight relative z-10">
                                {result.time}
                            </h2>
                            {result.dayOff && (
                                <p className="mt-4 inline-block relative z-10 px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400 font-semibold text-xs rounded-full">
                                    {result.dayOff}
                                </p>
                            )}
                        </div>
                    ) : (
                         <div className="text-center p-10 opacity-50">
                            <Globe size={64} className="mx-auto mb-4 animate-pulse" />
                            <p>Select zones to see output.</p>
                         </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
