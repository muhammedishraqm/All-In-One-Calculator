import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { PiggyBank, Briefcase, TrendingUp } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function RetirementSavings() {
    const { addCalculation } = useHistoryContext();
    const [currentAge, setCurrentAge] = useState(30);
    const [retireAge, setRetireAge] = useState(65);
    const [currentSavings, setCurrentSavings] = useState(10000);
    const [monthlyContribution, setMonthlyContribution] = useState(500);
    const [expectedReturn, setExpectedReturn] = useState(8);

    const breakdown = useMemo(() => {
        const cAge = Number(currentAge) || 0;
        const rAge = Number(retireAge) || 0;
        const yearsToGrow = Math.max(0, rAge - cAge);
        
        const initial = Number(currentSavings) || 0;
        const monthly = Number(monthlyContribution) || 0;
        const annualRate = (Number(expectedReturn) || 0) / 100;
        const monthlyRate = annualRate / 12;
        const totalMonths = yearsToGrow * 12;

        let futureValueInitial = 0;
        let futureValueContributions = 0;

        if (monthlyRate === 0) {
            futureValueInitial = initial;
            futureValueContributions = monthly * totalMonths;
        } else {
            // Compound interest for initial amount
            futureValueInitial = initial * Math.pow(1 + monthlyRate, totalMonths);
            // Future value of an annuity (monthly contributions)
            futureValueContributions = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate); // Assume contrib at end of month, removing (1+r) if at beginning. Let's do end of month:
            futureValueContributions = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        }

        const totalCorpus = futureValueInitial + futureValueContributions;
        const totalInvested = initial + (monthly * totalMonths);
        const totalInterest = totalCorpus - totalInvested;

        return {
            totalCorpus,
            totalInvested,
            totalInterest,
            years: yearsToGrow
        };
    }, [currentAge, retireAge, currentSavings, monthlyContribution, expectedReturn]);

    const handleCalculate = () => {
        if (!breakdown || breakdown.years <= 0) return;
        addCalculation({
             title: 'Retirement Savings',
             details: `Invest $${monthlyContribution}/mo for ${breakdown.years} years`,
             result: `$${(breakdown.totalCorpus / 1000000).toFixed(2)}M corpus`,
             category: 'PiggyBank'
        });
    }

    return (
        <CalculatorLayout
            title="Retirement Savings"
            description="Plan your long-term retirement corpus through compound growth."
            icon={PiggyBank}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Current Age
                            </label>
                            <input
                                type="number"
                                min="0" max="100"
                                value={currentAge}
                                onChange={(e) => setCurrentAge(e.target.value)}
                                onBlur={handleCalculate}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Retirement Age
                            </label>
                            <input
                                type="number"
                                min="0" max="100"
                                value={retireAge}
                                onChange={(e) => setRetireAge(e.target.value)}
                                onBlur={handleCalculate}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Current Savings ($)
                        </label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="number"
                                min="0"
                                value={currentSavings}
                                onChange={(e) => setCurrentSavings(e.target.value)}
                                onBlur={handleCalculate}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Monthly Contribution ($)
                        </label>
                        <div className="relative">
                            <PiggyBank className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="number"
                                min="0"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(e.target.value)}
                                onBlur={handleCalculate}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Exp. Annual Return (%)
                            </label>
                            <span className="text-primary-600 dark:text-primary-400 font-bold">{expectedReturn}%</span>
                        </div>
                        <input
                            type="range"
                            min="1" max="25" step="0.5"
                            value={expectedReturn}
                            onChange={(e) => setExpectedReturn(e.target.value)}
                            onMouseUp={handleCalculate}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary-500"
                        />
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-surface-dark border-teal-100 dark:border-teal-900/50 flex flex-col justify-center space-y-6">
                    {breakdown && breakdown.years > 0 ? (
                        <>
                            <div className="text-center p-6 bg-white dark:bg-surface-light rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Total Estimated Corpus</p>
                                <h2 className="text-4xl lg:text-5xl font-black text-teal-600 dark:text-teal-400 flex items-center justify-center gap-2">
                                    <TrendingUp size={36} />
                                    ${breakdown.totalCorpus.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">Total Invested Amount</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">${breakdown.totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                                    <p className="text-xs font-semibold text-teal-600/70 dark:text-teal-400/70 mb-1">Total Wealth Gained</p>
                                    <p className="text-xl font-bold text-teal-600 dark:text-teal-400">${breakdown.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                            <PiggyBank size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                            <p className="font-medium">Retirement Age must be greater than Current Age to calculate compound growth.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
