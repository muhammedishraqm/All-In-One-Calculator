import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Fuel, ArrowRightLeft } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function FuelEfficiencyConverter() {
    const { addCalculation } = useHistoryContext();
    const [amount, setAmount] = useState('');
    const [fromUnit, setFromUnit] = useState('kmpl');
    const [toUnit, setToUnit] = useState('mpg_us');

    const UNITS = {
        kmpl: { name: 'Kilometers per Liter (km/l)' },
        mpg_us: { name: 'Miles per Gallon (US)' },
        mpg_uk: { name: 'Miles per Gallon (UK)' },
        l100km: { name: 'Liters per 100km (L/100km)' }
    };

    const result = useMemo(() => {
        if (!amount || isNaN(amount)) return null;
        let val = parseFloat(amount);
        if (val === 0 && (fromUnit === 'l100km' || toUnit === 'l100km')) return 0; // Avoid divide by zero

        // Convert whatever to kmpl as base
        let baseKmpl = val;
        
        if (fromUnit === 'mpg_us') baseKmpl = val * 0.425143707;
        else if (fromUnit === 'mpg_uk') baseKmpl = val * 0.354006189;
        else if (fromUnit === 'l100km') baseKmpl = 100 / val; // Inverse relationship

        // Convert from kmpl to target
        let finalVal = baseKmpl;
        
        if (toUnit === 'mpg_us') finalVal = baseKmpl / 0.425143707;
        else if (toUnit === 'mpg_uk') finalVal = baseKmpl / 0.354006189;
        else if (toUnit === 'l100km') finalVal = 100 / baseKmpl;

        return finalVal;
    }, [amount, fromUnit, toUnit]);

    const handleLog = () => {
        if(result === null) return;
        addCalculation({
             title: 'Fuel Efficiency',
             details: `${amount} ${fromUnit} ➔ ${toUnit}`,
             result: `${result.toPrecision(5).replace(/\.?0+$/, '')} ${toUnit}`,
             category: 'Fuel'
        });
    }

    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    return (
        <CalculatorLayout
            title="Fuel Efficiency Converter"
            description="Convert between MPG, km/l, and L/100km seamlessly."
            icon={Fuel}
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
                             placeholder="e.g. 15"
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
                                onChange={(e) => { setToUnit(e.target.value); handleLog(); }}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium shadow-sm"
                            >
                                {Object.keys(UNITS).map(k => <option key={k} value={k}>{UNITS[k].name}</option>)}
                            </select>
                        </div>
                     </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-surface-dark border-green-100 dark:border-green-900/50 flex flex-col justify-center items-center space-y-6">
                    {result !== null ? (
                        <div className="text-center w-full">
                            <h2 className="text-5xl lg:text-6xl font-black text-green-600 dark:text-green-400 tracking-tight">
                                {result.toPrecision(5).replace(/\.?0+$/, '')}
                            </h2>
                            <p className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase mt-4">{UNITS[toUnit].name}</p>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Fuel size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter a value to see the conversion.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
