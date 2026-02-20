import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Map, ArrowRightLeft } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

const UNITS = {
    sqm: { name: 'Square Meters (sq m)', toBase: val => val, fromBase: val => val },
    sqkm: { name: 'Square Kilometers (sq km)', toBase: val => val * 1000000, fromBase: val => val / 1000000 },
    sqft: { name: 'Square Feet (sq ft)', toBase: val => val * 0.092903, fromBase: val => val / 0.092903 },
    sqmi: { name: 'Square Miles (sq mi)', toBase: val => val * 2589988.11, fromBase: val => val / 2589988.11 },
    acre: { name: 'Acres (ac)', toBase: val => val * 4046.86, fromBase: val => val / 4046.86 },
    hectare: { name: 'Hectares (ha)', toBase: val => val * 10000, fromBase: val => val / 10000 },
};

export default function AreaConverter() {
    const { addCalculation } = useHistoryContext();
    const [amount, setAmount] = useState('');
    const [fromUnit, setFromUnit] = useState('sqft');
    const [toUnit, setTargetUnit] = useState('sqm'); // renamed var to avoid clash in previous clones if any

    const result = useMemo(() => {
        if (!amount || isNaN(amount)) return null;
        const val = parseFloat(amount);
        const baseSqm = UNITS[fromUnit].toBase(val);
        const finalVal = UNITS[toUnit].fromBase(baseSqm);
        return finalVal;
    }, [amount, fromUnit, toUnit]);

    const handleLog = () => {
        if(result === null) return;
        addCalculation({
             title: 'Area Converter',
             details: `${amount} ${fromUnit} ➔ ${toUnit}`,
             result: `${result.toPrecision(6).replace(/\.?0+$/, '')} ${toUnit}`,
             category: 'Map'
        });
    }

    const swapUnits = () => {
        setFromUnit(toUnit);
        setTargetUnit(fromUnit);
    };

    return (
        <CalculatorLayout
            title="Area Converter"
            description="Quickly convert land scale and square measurements."
            icon={Map}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                             Enter Value
                         </label>
                         <input
                             type="number"
                             value={amount}
                             onChange={(e) => setAmount(e.target.value)}
                             onBlur={handleLog}
                             placeholder="e.g. 1000"
                             className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                         />
                    </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4 relative">
                        <div>
                             <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 px-2">From</label>
                             <select
                                 value={fromUnit}
                                 onChange={(e) => { setFromUnit(e.target.value); handleLog(); }}
                                 className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium shadow-sm"
                             >
                                 {Object.keys(UNITS).map(k => <option key={k} value={k}>{UNITS[k].name}</option>)}
                             </select>
                        </div>
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 z-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600" onClick={swapUnits}>
                            <ArrowRightLeft size={20} className="text-primary-500" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 px-2">To</label>
                            <select
                                value={toUnit}
                                onChange={(e) => { setTargetUnit(e.target.value); handleLog(); }}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium shadow-sm"
                            >
                                {Object.keys(UNITS).map(k => <option key={k} value={k}>{UNITS[k].name}</option>)}
                            </select>
                        </div>
                     </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-surface-dark border-emerald-100 dark:border-emerald-900/50 flex flex-col justify-center items-center space-y-6">
                    {result !== null ? (
                        <div className="text-center w-full">
                            <h2 className="text-5xl lg:text-6xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                                {result.toPrecision(6).replace(/\.?0+$/, '')}
                            </h2>
                            <p className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase mt-4">{UNITS[toUnit].name}</p>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Map size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter a value to see the conversion.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
