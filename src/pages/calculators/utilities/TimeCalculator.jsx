import React, { useState } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Clock, Plus, Minus, Search } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function TimeCalculator() {
    const { addCalculation } = useHistoryContext();
    const [time1, setTime1] = useState('12:00');
    const [modifier, setModifier] = useState('add'); // 'add', 'sub'
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const calculateTime = () => {
        if (!time1) return null;

        const [h1, m1] = time1.split(':').map(Number);
        const addH = parseInt(hours) || 0;
        const addM = parseInt(minutes) || 0;

        let date = new Date(2000, 0, 1, h1, m1);

        if (modifier === 'add') {
            date.setHours(date.getHours() + addH);
            date.setMinutes(date.getMinutes() + addM);
        } else {
            date.setHours(date.getHours() - addH);
            date.setMinutes(date.getMinutes() - addM);
        }

        const hOut = String(date.getHours()).padStart(2, '0');
        const mOut = String(date.getMinutes()).padStart(2, '0');
        
        // Handling days cross
        const daysCrossed = date.getDate() - 1;

        return {
            resultTime: `${hOut}:${mOut}`,
            daysCrossed: daysCrossed
        };
    };

    const handleCalculate = () => {
        const result = calculateTime();
        if(!result) return;
        
        let msg = `${result.resultTime}`;
        if(result.daysCrossed > 0) msg += ` (Next Day)`;
        if(result.daysCrossed < 0) msg += ` (Prev Day)`;

        addCalculation({
             title: 'Time Calculation',
             details: `${time1} ${modifier === 'add' ? '+' : '-'} ${hours}h ${minutes}m`,
             result: msg,
             category: 'Clock'
        });
    };

    const result = calculateTime();

    return (
        <CalculatorLayout
            title="Time Calculator"
            description="Add or subtract hours and minutes from a specific time."
            icon={Clock}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Starting Time
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="time"
                                required
                                value={time1}
                                onChange={(e) => setTime1(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <button
                            onClick={() => setModifier('add')}
                            className={`flex-1 py-2 flex justify-center items-center rounded-lg transition-all ${modifier === 'add' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            <Plus size={20} className="mr-2" /> Add Time
                        </button>
                        <button
                            onClick={() => setModifier('sub')}
                            className={`flex-1 py-2 flex justify-center items-center rounded-lg transition-all ${modifier === 'sub' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            <Minus size={20} className="mr-2" /> Subtract Result
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Hours
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                onBlur={handleCalculate}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium text-center text-lg"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Minutes
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                onBlur={handleCalculate}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium text-center text-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-surface-dark border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         <div className="text-center p-10 bg-white dark:bg-surface-light rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full">
                            <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-4">Result Time</p>
                            <h2 className="text-6xl font-black text-primary-600 dark:text-primary-400 tracking-tight">
                                {result.resultTime}
                            </h2>
                            {result.daysCrossed !== 0 && (
                                <p className="mt-4 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400 font-semibold text-xs rounded-full">
                                    {result.daysCrossed > 0 ? '+1 Day (Tomorrow)' : '-1 Day (Yesterday)'}
                                </p>
                            )}
                        </div>
                    ) : (
                         <div className="text-center p-10 opacity-50">
                            <Clock size={64} className="mx-auto mb-4 animate-pulse" />
                            <p>Enter time block to see results.</p>
                         </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
