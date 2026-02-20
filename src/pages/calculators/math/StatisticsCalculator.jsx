import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Calculator } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function StatisticsCalculator() {
  const [dataInput, setDataInput] = useState('10, 20, 30, 40, 50');
  const [result, setResult] = useState(null);
  
  const { addCalculation } = useHistoryContext();

  useEffect(() => {
    calculateStats();
  }, [dataInput]);

  const calculateStats = () => {
    // Parse the input string into an array of numbers
    const values = dataInput
      .split(/,|\s+/) // Split on comma or whitespace
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v));

    if (values.length === 0) {
      setResult(null);
      return;
    }

    const n = values.length;
    
    // Mean
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Median
    const sorted = [...values].sort((a, b) => a - b);
    let median;
    if (n % 2 !== 0) {
        median = sorted[Math.floor(n / 2)];
    } else {
        const mid1 = sorted[(n / 2) - 1];
        const mid2 = sorted[n / 2];
        median = (mid1 + mid2) / 2;
    }

    // Mode
    const freqMap = {};
    let maxFreq = 0;
    values.forEach(v => {
        freqMap[v] = (freqMap[v] || 0) + 1;
        if (freqMap[v] > maxFreq) maxFreq = freqMap[v];
    });
    
    let modes = [];
    if (maxFreq > 1) {
       for (const k in freqMap) {
          if (freqMap[k] === maxFreq) modes.push(Number(k));
       }
    }
    const modeStr = modes.length > 0 ? modes.join(', ') : 'None';

    // Min & Max
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    // Sample Standard Deviation & Variance (n-1 degrees of freedom)
    let varianceSample = 0;
    let stdDevSample = 0;
    if (n > 1) {
        const sumSqErrors = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
        varianceSample = sumSqErrors / (n - 1);
        stdDevSample = Math.sqrt(varianceSample);
    }
    
    // Population Standard Deviation
    const vrPop = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const stdDevPop = Math.sqrt(vrPop);

    const stats = {
        n,
        sum: Number(sum.toFixed(4)),
        mean: Number(mean.toFixed(4)),
        median: Number(median.toFixed(4)),
        mode: modeStr,
        min,
        max,
        range: Number(range.toFixed(4)),
        stdDevSamp: Number(stdDevSample.toFixed(4)),
        stdDevPop: Number(stdDevPop.toFixed(4))
    };

    setResult(stats);

    if (n > 2) {
      addCalculation({
        type: 'Statistics',
        summary: `Mean: <b>${stats.mean}</b>, StdDev: <b>${stats.stdDevSamp}</b> <br/> <span class="text-xs text-gray-500">n=${stats.n}, Range=${stats.range}</span>`
      });
    }
  };

  return (
    <CalculatorLayout 
      title="Statistics Calculator" 
      description="Calculate mean, median, mode, standard deviation, and variance for a dataset."
      icon={Calculator}
    >
      <div className="grid grid-cols-1 gap-8 mt-6">
        
        {/* Input Section */}
        <div className="card p-6 space-y-4">
          <div>
            <label className="label-text flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Dataset</span>
              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-500">
                  {result ? `${result.n} values` : '0 values'}
              </span>
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Enter numbers separated by commas or spaces.</p>
            <textarea 
              className="input-field min-h-[120px] resize-y" 
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              placeholder="e.g. 5, 12, 8, 30, 2, 8..."
            />
          </div>
        </div>

        {/* Result Section */}
        {result ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                
                {/* Core Averages */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 card p-6 bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/30">
                    <div className="text-center md:text-left">
                        <span className="block text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Mean</span>
                        <span className="text-4xl font-black text-gray-900 dark:text-gray-100">{result.mean}</span>
                    </div>
                    <div className="text-center md:text-left border-t border-b md:border-t-0 md:border-b-0 md:border-x border-primary-200 dark:border-primary-800 py-4 md:py-0 md:px-6">
                        <span className="block text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Median</span>
                        <span className="text-4xl font-black text-gray-900 dark:text-gray-100">{result.median}</span>
                    </div>
                    <div className="text-center md:text-left md:pl-6">
                        <span className="block text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Mode</span>
                        <span className="text-3xl font-black text-gray-900 dark:text-gray-100 break-words">{result.mode}</span>
                    </div>
                </div>

                {/* Dispersion */}
                <div className="card p-6 flex flex-col justify-center">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Std Dev (Sample, s)</span>
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{result.stdDevSamp}</span>
                    <span className="text-xs text-gray-400 mt-2">Pop: σ ≈ {result.stdDevPop}</span>
                </div>

                {/* Range */}
                 <div className="card p-6 flex flex-col justify-center">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Range</span>
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{result.range}</span>
                    <span className="text-xs text-gray-400 mt-2">Min: {result.min}  |  Max: {result.max}</span>
                </div>

            </div>
        ) : (
            <div className="card p-6 min-h-[150px] flex items-center justify-center text-center text-gray-400">
               Enter valid data to generate statistical analysis.
            </div>
        )}

      </div>
    </CalculatorLayout>
  );
}
