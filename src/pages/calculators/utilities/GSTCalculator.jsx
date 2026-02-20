import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { IndianRupee } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function GSTCalculator() {
  const [baseAmount, setBaseAmount] = useState('1000');
  const [gstRate, setGstRate] = useState('18');
  const [mode, setMode] = useState('add'); // 'add' or 'remove'
  
  const [result, setResult] = useState(null);
  const { addCalculation } = useHistoryContext();

  const GST_SLABS = [5, 12, 18, 28];

  useEffect(() => {
    calculateGST();
  }, [baseAmount, gstRate, mode]);

  const calculateGST = () => {
    const amount = parseFloat(baseAmount);
    const rate = parseFloat(gstRate);

    if (isNaN(amount) || amount <= 0 || isNaN(rate) || rate < 0) {
      setResult(null);
      return;
    }

    let gstAmount = 0;
    let finalAmount = 0;
    let netPrice = 0;

    if (mode === 'add') {
        netPrice = amount;
        gstAmount = (amount * rate) / 100;
        finalAmount = amount + gstAmount;
    } else { // Remove GST (Reverse Calculation)
        finalAmount = amount;
        gstAmount = amount - (amount * (100 / (100 + rate)));
        netPrice = finalAmount - gstAmount;
    }

    const cgstAmount = gstAmount / 2;
    const sgstAmount = gstAmount / 2;

    setResult({
        netPrice,
        gstAmount,
        cgstAmount,
        sgstAmount,
        finalAmount
    });

    if (amount > 0) {
      const modeStr = mode === 'add' ? '+GST' : '-GST';
      addCalculation({
        type: `GST Calculator (${modeStr})`,
        summary: `Total: <b>${formatCurrency(finalAmount)}</b> <br/> <span class="text-xs text-gray-500">Net: ${formatCurrency(netPrice)} &nbsp;|&nbsp; GST@${rate}%</span>`
      });
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

  return (
    <CalculatorLayout 
      title="India GST Calculator" 
      description="Calculate Goods and Services Tax (GST) inclusive and exclusive amounts."
      icon={IndianRupee}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        
        {/* Input Section */}
        <div className="card p-6 space-y-8">
          
          {/* Add / Remove Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button 
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${mode === 'add' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
              onClick={() => setMode('add')}
            >
              Add GST (+%)
            </button>
            <button 
               className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${mode === 'remove' ? 'bg-white dark:bg-gray-700 shadow-sm text-rose-500 dark:text-rose-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
              onClick={() => setMode('remove')}
            >
              Remove GST (-%)
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="label-text">
                  {mode === 'add' ? 'Net Amount (Before GST)' : 'Total Amount (After GST)'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input 
                  type="number" 
                  min="0"
                  className="input-field pl-10 text-xl font-bold" 
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div>
               <label className="label-text flex justify-between">
                  <span>GST Slab Rate (%)</span>
                  <span className="text-gray-500">{gstRate}%</span>
               </label>
               <div className="grid grid-cols-4 gap-2 mb-4">
                  {GST_SLABS.map(slab => (
                      <button 
                          key={slab}
                          onClick={() => setGstRate(slab.toString())}
                          className={`py-2 rounded-lg font-bold border transition-colors ${gstRate === slab.toString() ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                      >
                          {slab}%
                      </button>
                  ))}
               </div>
               
               {/* Custom Rate Input */}
               <div className="relative w-1/2">
                   <input 
                       type="number"
                       step="0.1" 
                       min="0"
                       className="input-field pr-10" 
                       value={gstRate}
                       onChange={(e) => setGstRate(e.target.value)}
                       placeholder="Custom %"
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
               </div>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
            {result ? (
                <div className="card h-full flex flex-col pt-8 pb-4">
                     
                     <div className="text-center mb-8 px-6">
                         <span className="text-sm font-semibold tracking-widest text-primary-600 dark:text-primary-400 uppercase">
                             Total Bill Value
                         </span>
                         <div className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-100 mt-2">
                             {formatCurrency(result.finalAmount)}
                         </div>
                     </div>

                     <div className="flex-1 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800 p-8 space-y-6">
                         
                         <div className="flex justify-between items-center text-lg">
                             <span className="text-gray-500 font-medium">Net Value</span>
                             <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(result.netPrice)}</span>
                         </div>
                         
                         <div className="flex justify-between items-center text-lg">
                             <span className="text-gray-500 font-medium">Total GST</span>
                             <span className="font-bold text-rose-500 dark:text-rose-400">{formatCurrency(result.gstAmount)}</span>
                         </div>

                         {/* SGST / CGST Split */}
                         <div className="pt-4 border-t border-gray-200 dark:border-gray-700 border-dashed grid grid-cols-2 gap-4">
                              <div className="flex flex-col">
                                  <span className="text-xs tracking-wider text-gray-400 uppercase font-bold mb-1">CGST ({(parseFloat(gstRate)/2).toFixed(1)}%)</span>
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">{formatCurrency(result.cgstAmount)}</span>
                              </div>
                              <div className="flex flex-col text-right">
                                  <span className="text-xs tracking-wider text-gray-400 uppercase font-bold mb-1">SGST ({(parseFloat(gstRate)/2).toFixed(1)}%)</span>
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">{formatCurrency(result.sgstAmount)}</span>
                              </div>
                         </div>
                     </div>

                </div>
            ) : (
                <div className="card p-6 h-full flex items-center justify-center text-center text-gray-400">
                    <div>
                        <IndianRupee size={48} className="mx-auto opacity-20 mb-4" />
                        <p>Enter an amount and select a GST slab.</p>
                    </div>
                </div>
            )}
        </div>

      </div>
    </CalculatorLayout>
  );
}
