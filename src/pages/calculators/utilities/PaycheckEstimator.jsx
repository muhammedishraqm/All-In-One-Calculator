import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Banknote, Calculator, PiggyBank, Briefcase } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function PaycheckEstimator() {
    const { addCalculation } = useHistoryContext();
    const [grossPay, setGrossPay] = useState('');
    const [payFrequency, setPayFrequency] = useState('annual'); // 'annual', 'monthly', 'biweekly', 'weekly', 'hourly'
    const [hoursPerWeek, setHoursPerWeek] = useState(40);
    const [taxRate, setTaxRate] = useState(25); // Baseline estimated tax rate

    const breakdown = useMemo(() => {
        const val = parseFloat(grossPay) || 0;
        const taxVal = parseFloat(taxRate) || 0;
        let annualGross = 0;

        if (val === 0) return null;

        // Convert anything up to annual
        if (payFrequency === 'annual') annualGross = val;
        else if (payFrequency === 'monthly') annualGross = val * 12;
        else if (payFrequency === 'biweekly') annualGross = val * 26;
        else if (payFrequency === 'weekly') annualGross = val * 52;
        else if (payFrequency === 'hourly') annualGross = val * (parseFloat(hoursPerWeek) || 0) * 52;

        const annualTax = annualGross * (taxVal / 100);
        const annualNet = annualGross - annualTax;

        return {
            annual: { gross: annualGross, net: annualNet, tax: annualTax },
            monthly: { gross: annualGross / 12, net: annualNet / 12, tax: annualTax / 12 },
            biweekly: { gross: annualGross / 26, net: annualNet / 26, tax: annualTax / 26 },
            weekly: { gross: annualGross / 52, net: annualNet / 52, tax: annualTax / 52 },
        };
    }, [grossPay, payFrequency, hoursPerWeek, taxRate]);

    const handleLog = () => {
        if(!breakdown) return;
        addCalculation({
             title: 'Paycheck Estimator',
             details: `${grossPay} ${payFrequency}, ${taxRate}% Tax`,
             result: `$${breakdown.monthly.net.toFixed(0)}/mo net`,
             category: 'Banknote'
        });
    }

    return (
        <CalculatorLayout
            title="Paycheck Estimator"
            description="Estimate net take-home salary after taxes and deductions."
            icon={Banknote}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Gross Pay Amount
                        </label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="number"
                                required
                                value={grossPay}
                                onChange={(e) => setGrossPay(e.target.value)}
                                onBlur={handleLog}
                                placeholder="e.g. 80000"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Pay Frequency
                            </label>
                            <select
                                value={payFrequency}
                                onChange={(e) => setPayFrequency(e.target.value)}
                                onBlur={handleLog}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                            >
                                <option value="annual">Annually</option>
                                <option value="monthly">Monthly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="weekly">Weekly</option>
                                <option value="hourly">Hourly</option>
                            </select>
                        </div>
                        {payFrequency === 'hourly' && (
                            <div className="w-32">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Hrs / Wk
                                </label>
                                <input
                                    type="number"
                                    value={hoursPerWeek}
                                    onChange={(e) => setHoursPerWeek(e.target.value)}
                                    onBlur={handleLog}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Estimated Total Tax Rate (%)
                            </label>
                            <span className="text-primary-600 dark:text-primary-400 font-bold">{taxRate}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="60"
                            value={taxRate}
                            onChange={(e) => setTaxRate(e.target.value)}
                            onMouseUp={handleLog}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary-500"
                        />
                        <p className="text-xs text-gray-500 mt-2">Includes Federal, State, and local taxes.</p>
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-surface-dark border-green-100 dark:border-green-900/50 flex flex-col justify-center space-y-6">
                    {breakdown ? (
                        <>
                            <div className="text-center p-6 bg-white dark:bg-surface-light rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Net Monthly Take-Home</p>
                                <h2 className="text-4xl font-black text-green-600 dark:text-green-500">
                                    ${breakdown.monthly.net.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">Annual Gross</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${breakdown.annual.gross.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">Annual Net</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${breakdown.annual.net.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                                <div className="col-span-2 p-4 bg-white dark:bg-surface-light rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                                     <p className="text-xs font-semibold text-red-500/70 mb-1 uppercase tracking-widest">Total Estimated Taxes (Annual)</p>
                                     <p className="text-lg font-bold text-red-600 dark:text-red-400">-${breakdown.annual.tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                            <Banknote size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                            <p className="font-medium">Enter your gross salary details to see your take-home pay estimate.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
