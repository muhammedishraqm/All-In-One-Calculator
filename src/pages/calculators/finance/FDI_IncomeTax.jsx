import React, { useState, useMemo } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Banknote } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function FDI_IncomeTax() {
    const { addCalculation } = useHistoryContext();
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [years, setYears] = useState('');
    const [taxSlab, setTaxSlab] = useState('0'); // percentage
    const [seniorCitizen, setSeniorCitizen] = useState(false);

    const result = useMemo(() => {
        if (!principal || !rate || !years) return null;
        const p = parseFloat(principal);
        const r = parseFloat(rate);
        const t = parseFloat(years);
        const slab = parseFloat(taxSlab);

        if (isNaN(p) || isNaN(r) || isNaN(t) || p < 0 || r < 0 || t < 0) return { error: 'Invalid details' };

        // Simple Compound Interest formula A = P(1+r/n)^nt. Assume quarterly compounding for typical FDs.
        const n = 4;
        const amount = p * Math.pow((1 + (r / 100) / n), n * t);
        const totalInterest = amount - p;

        // Indian Tax logic approximation:
        // Exemption: Normal = RS 40,000 | Senior = RS 50,000 threshold for TDS
        let taxableInterest = totalInterest;
        let tdsRate = 0;
        let tdsAmount = 0;
        let totalTax = 0;

        const limit = seniorCitizen ? 50000 : 40000;
        if (totalInterest > limit) {
             tdsRate = 10; // Standard TDS of 10%
             tdsAmount = totalInterest * (tdsRate / 100);
        }

        // Final tax based on income slab
        totalTax = totalInterest * (slab / 100);

        // Adjust for TDS already paid
        const remainingTaxToPay = Math.max(0, totalTax - tdsAmount);
        // Note: For simplicity, we just show Total Tax Liability and TDS deducted.

        const netIncome = totalInterest - totalTax;

        return {
            totalInterest: totalInterest.toFixed(2),
            slabTax: totalTax.toFixed(2),
            tdsDeducted: tdsAmount.toFixed(2),
            netIncome: netIncome.toFixed(2),
            amount: amount.toFixed(2)
        };

    }, [principal, rate, years, taxSlab, seniorCitizen]);

    const handleLog = () => {
        if(!result || result.error) return;
        addCalculation({
             title: 'FD Returns & Tax',
             details: `₹${principal} @ ${rate}%`,
             result: `Net ₹${result.netIncome}`,
             category: 'Banknote'
        });
    }

    return (
        <CalculatorLayout
            title="FD Income Tax Estimator"
            description="Calculate Fixed Deposit returns and estimate tax liability."
            icon={Banknote}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="card p-6 space-y-6">
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Principal Amount</label>
                         <input type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="e.g. 500000" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Interest Rate (%)</label>
                             <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="e.g. 7.5" />
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tenure (Years)</label>
                             <input type="number" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} onBlur={handleLog} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none" placeholder="e.g. 5" />
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Tax Slab</label>
                         <select value={taxSlab} onChange={(e) => {setTaxSlab(e.target.value); handleLog()}} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none">
                             <option value="0">0% (Nil)</option>
                             <option value="5">5%</option>
                             <option value="10">10%</option>
                             <option value="15">15%</option>
                             <option value="20">20%</option>
                             <option value="30">30%</option>
                         </select>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="senior" checked={seniorCitizen} onChange={(e) => setSeniorCitizen(e.target.checked)} className="w-5 h-5 accent-emerald-500 rounded" />
                        <label htmlFor="senior" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">I am a Senior Citizen (Age 60+)</label>
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-surface-dark border-emerald-100 dark:border-emerald-900/50 flex flex-col justify-center items-center space-y-6">
                    {result ? (
                         result.error ? (
                             <div className="text-red-500 font-semibold">{result.error}</div>
                         ) : (
                            <div className="w-full space-y-4">
                                <div className="text-center">
                                    <p className="text-sm font-bold tracking-wider text-emerald-500 dark:text-emerald-400 uppercase mb-2">Post Tax Interest</p>
                                    <h2 className="text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight leading-tight mb-6">
                                        ₹{parseFloat(result.netIncome).toLocaleString()}
                                    </h2>
                                </div>

                                <div className="space-y-2 text-sm max-w-sm mx-auto p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-500 font-medium tracking-wide">Gross Interest Earned</span>
                                        <span className="font-bold">₹{parseFloat(result.totalInterest).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-500 font-medium tracking-wide">TDS Deducted (10%)</span>
                                        <span className="font-bold text-red-500">- ₹{parseFloat(result.tdsDeducted).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-500 font-medium tracking-wide flex flex-col">
                                            Total Tax Liability
                                            <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-tight mt-1">Slab: {taxSlab}%</span>
                                        </span>
                                        <span className="font-bold text-orange-500 mt-2">₹{parseFloat(result.slabTax).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span className="text-emerald-500 font-black tracking-wide">Maturity Amount</span>
                                        <span className="font-black">₹{parseFloat(result.amount).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                         )
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Banknote size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter FD setup to calculate net tax and returns.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
