import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Fuel, MapPin, Gauge, DollarSign } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function FuelExpenses() {
    const { addCalculation } = useHistoryContext();
    const [distance, setDistance] = useState('');
    const [efficiency, setEfficiency] = useState('');
    const [price, setPrice] = useState('');
    const [efficiencyUnit, setEfficiencyUnit] = useState('kmpl'); // 'kmpl', 'l100km', 'mpg'

    const { fuelNeeded, totalCost } = useMemo(() => {
        const d = parseFloat(distance) || 0;
        const e = parseFloat(efficiency) || 0;
        const p = parseFloat(price) || 0;
        
        let fuel = 0;
        if (d > 0 && e > 0) {
            if (efficiencyUnit === 'kmpl' || efficiencyUnit === 'mpg') {
                fuel = d / e;
            } else if (efficiencyUnit === 'l100km') {
                fuel = (d / 100) * e;
            }
        }
        
        return {
            fuelNeeded: fuel,
            totalCost: fuel * p
        };
    }, [distance, efficiency, price, efficiencyUnit]);

    const handleCalculate = (e) => {
        e.preventDefault();
        if(!distance || !efficiency || !price || totalCost === 0) return;

        addCalculation({
             title: 'Fuel Expenses',
             details: `${distance} distance at ${efficiency} ${efficiencyUnit}`,
             result: `$${totalCost.toFixed(2)} cost`,
             category: 'Fuel'
        });
    };

    return (
        <CalculatorLayout
            title="Fuel Expenses"
            description="Calculate trip fuel requirements and total travel costs."
            icon={Fuel}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <form onSubmit={handleCalculate} className="card p-6 space-y-5">
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Trip Distance
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="number"
                                required
                                min="0"
                                step="any"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                placeholder="e.g. 500"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Fuel Efficiency
                            </label>
                            <div className="relative">
                                <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="any"
                                    value={efficiency}
                                    onChange={(e) => setEfficiency(e.target.value)}
                                    placeholder="e.g. 15"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                                />
                            </div>
                        </div>
                        <div className="w-32">
                           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Unit
                            </label>
                            <select
                                value={efficiencyUnit}
                                onChange={(e) => setEfficiencyUnit(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium appearance-none"
                            >
                                <option value="kmpl">km/l</option>
                                <option value="l100km">l/100km</option>
                                <option value="mpg">mpg</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Fuel Price (per unit)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="number"
                                required
                                min="0"
                                step="any"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="e.g. 1.50"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full btn-primary py-3.5 mt-2">
                        Calculate Expenses
                    </button>
                </form>

                {/* Results Section */}
                <div className="card p-6 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-surface-dark border-green-100 dark:border-green-900/50 flex flex-col justify-center space-y-6">
                     <div className="text-center p-6 bg-white dark:bg-surface-light rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Total Trip Cost</p>
                        <h2 className="text-5xl font-black text-green-600 dark:text-green-500 mb-2">
                            ${totalCost.toFixed(2)}
                        </h2>
                    </div>

                    <div className="p-5 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                <Fuel size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Fuel Required</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {fuelNeeded.toFixed(2)} {efficiencyUnit === 'mpg' ? 'Gallons' : 'Liters'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
}
