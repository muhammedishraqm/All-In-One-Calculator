import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Utensils, DollarSign, Users, Receipt } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function TipSplitter() {
    const { addCalculation } = useHistoryContext();
    const [billAmount, setBillAmount] = useState('');
    const [tipPercentage, setTipPercentage] = useState(15);
    const [numberOfPeople, setNumberOfPeople] = useState(2);

    const {
        tipAmount,
        totalAmount,
        tipPerPerson,
        totalPerPerson
    } = useMemo(() => {
        const val = parseFloat(billAmount) || 0;
        const tipPct = parseFloat(tipPercentage) || 0;
        const people = parseInt(numberOfPeople) || 1;

        const calculatedTip = val * (tipPct / 100);
        const calculatedTotal = val + calculatedTip;

        return {
            tipAmount: calculatedTip,
            totalAmount: calculatedTotal,
            tipPerPerson: calculatedTip / people,
            totalPerPerson: calculatedTotal / people
        };
    }, [billAmount, tipPercentage, numberOfPeople]);

    const handleCalculate = () => {
        if (!billAmount || isNaN(billAmount)) return;

        addCalculation({
            title: 'Tip & Bill Split',
            details: `Bill $${billAmount}, Tip ${tipPercentage}%, Split ${numberOfPeople} ways`,
            result: `$${totalPerPerson.toFixed(2)}/person`,
            category: 'Utensils' // Icon name reference
        });
    };

    return (
        <CalculatorLayout
            title="Tip & Bill Splitter"
            description="Calculate tips accurately and split the bill among friends."
            icon={Utensils}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="card p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Total Bill Amount ($)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="number"
                                value={billAmount}
                                onChange={(e) => setBillAmount(e.target.value)}
                                onBlur={handleCalculate}
                                placeholder="0.00"
                                min="0"
                                step="any"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 text-lg font-bold"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Tip Percentage
                            </label>
                            <span className="text-primary-600 dark:text-primary-400 font-bold">{tipPercentage}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            step="1"
                            value={tipPercentage}
                            onChange={(e) => setTipPercentage(e.target.value)}
                            onMouseUp={handleCalculate}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary-500"
                        />
                        <div className="flex justify-between mt-3 gap-2">
                            {[10, 15, 18, 20].map((pct) => (
                                <button
                                    key={pct}
                                    onClick={() => { setTipPercentage(pct); handleCalculate(); }}
                                    className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                        tipPercentage == pct 
                                            ? 'bg-primary-500 text-white shadow-md' 
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {pct}%
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Number of People
                            </label>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{numberOfPeople}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Users className="text-gray-400" size={24} />
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="1"
                                value={numberOfPeople}
                                onChange={(e) => setNumberOfPeople(e.target.value)}
                                onMouseUp={handleCalculate}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Card */}
                <div className="card p-6 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-surface-dark border-primary-100 dark:border-primary-900/50 flex flex-col justify-between space-y-8">
                    
                    <div className="text-center p-6 bg-white dark:bg-surface-light rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Total Per Person</p>
                        <h2 className="text-5xl font-black text-primary-600 dark:text-primary-400">
                            ${totalPerPerson.toFixed(2)}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 mb-1">Tip Amount</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${tipAmount.toFixed(2)}</p>
                            </div>
                         </div>
                         <div className="p-4 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 mb-1">Total Amount</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${totalAmount.toFixed(2)}</p>
                            </div>
                         </div>
                         <div className="p-4 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 mb-1">Tip / Person</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${tipPerPerson.toFixed(2)}</p>
                            </div>
                         </div>
                         <div className="p-4 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 mb-1">Bill / Person</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${(totalAmount/numberOfPeople - tipPerPerson).toFixed(2)}</p>
                            </div>
                         </div>
                    </div>

                </div>
            </div>
        </CalculatorLayout>
    );
}
