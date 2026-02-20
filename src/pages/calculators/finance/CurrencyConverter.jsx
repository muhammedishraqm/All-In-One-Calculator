import React, { useState, useMemo, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Coins, ArrowRightLeft } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

// Hardcoded fallback rates relative to USD if API fails or offline
const FALLBACK_RATES = {
    USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.2, AUD: 1.53, CAD: 1.35, JPY: 151,
    CNY: 7.23, CHF: 0.9, NZD: 1.66, SGD: 1.34, ZAR: 18.8
};

const CURRENCIES = Object.keys(FALLBACK_RATES);

export default function CurrencyConverter() {
    const { addCalculation } = useHistoryContext();
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');
    const [rates, setRates] = useState(FALLBACK_RATES);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Attempt to fetch fresh rates from a free public API
        // If it fails or we hit limits, we just silently fall back to hardcoded.
        fetch('https://open.er-api.com/v6/latest/USD')
            .then(res => res.json())
            .then(data => {
                if (data && data.rates) {
                    setRates(data.rates);
                    setIsOffline(false);
                } else {
                    setIsOffline(true);
                }
            })
            .catch(() => setIsOffline(true));
    }, []);

    const result = useMemo(() => {
        if (!amount || isNaN(amount)) return null;
        const val = parseFloat(amount);

        // Convert through USD as base
        const valInUSD = val / (rates[fromCurrency] || FALLBACK_RATES[fromCurrency] || 1);
        const finalVal = valInUSD * (rates[toCurrency] || FALLBACK_RATES[toCurrency] || 1);

        return finalVal;
    }, [amount, fromCurrency, toCurrency, rates]);

    const handleLog = () => {
        if(result === null) return;
        addCalculation({
             title: 'Currency Converter',
             details: `${amount} ${fromCurrency} ➔ ${toCurrency}`,
             result: `${result.toFixed(2)} ${toCurrency}`,
             category: 'Coins'
        });
    }

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    return (
        <CalculatorLayout
            title="Currency Converter"
            description="Convert world currencies instantly (uses live fallback)."
            icon={Coins}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-6">
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                             Enter Amount
                         </label>
                         <input
                             type="number"
                             value={amount}
                             onChange={(e) => setAmount(e.target.value)}
                             onBlur={handleLog}
                             placeholder="e.g. 100"
                             className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium"
                         />
                    </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4 relative">
                        <div>
                             <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 px-2">From</label>
                             <select
                                 value={fromCurrency}
                                 onChange={(e) => { setFromCurrency(e.target.value); handleLog(); }}
                                 className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium shadow-sm"
                             >
                                 {Object.keys(rates).sort().map(k => <option key={k} value={k}>{k}</option>)}
                             </select>
                        </div>
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 z-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600" onClick={swapCurrencies}>
                            <ArrowRightLeft size={20} className="text-secondary-500 text-yellow-500 dark:text-yellow-400" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 px-2">To</label>
                            <select
                                value={toCurrency}
                                onChange={(e) => { setToCurrency(e.target.value); handleLog(); }}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium shadow-sm"
                            >
                                {Object.keys(rates).sort().map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                     </div>
                     {isOffline && <p className="text-xs text-orange-500 mt-2 font-medium">Using cached offline rates.</p>}
                </div>

                <div className="card p-6 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-surface-dark border-yellow-100 dark:border-yellow-900/50 flex flex-col justify-center items-center space-y-6">
                    {result !== null ? (
                        <div className="text-center w-full">
                            <h2 className="text-5xl lg:text-5xl font-black text-yellow-600 dark:text-yellow-400 tracking-tight break-all">
                                {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h2>
                            <p className="text-xl font-bold text-gray-500 dark:text-gray-400 mt-4">{toCurrency}</p>
                            
                            <div className="mt-8 pt-4 border-t border-yellow-200 dark:border-yellow-900/40 text-sm font-semibold text-gray-500">
                                1 {fromCurrency} = {(1 / (rates[fromCurrency] || FALLBACK_RATES[fromCurrency] || 1) * (rates[toCurrency] || FALLBACK_RATES[toCurrency] || 1)).toFixed(4)} {toCurrency}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-600 p-8">
                             <Coins size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                             <p className="font-medium">Enter an amount to see current exchange.</p>
                        </div>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
}
