import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Calculator } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function ProbabilityCalculator() {
  const [trials, setTrials] = useState('10'); // Number of trials (n)
  const [probSuccess, setProbSuccess] = useState('0.5'); // Probability of success (p)
  const [successes, setSuccesses] = useState('5'); // Number of successes (k)
  
  const [result, setResult] = useState(null);
  const { addCalculation } = useHistoryContext();

  // Helper: Factorial
  const fact = (num) => {
    let rval = 1;
    for (let i = 2; i <= num; i++) rval = rval * i;
    return rval;
  };

  // Helper: Combinations nCr
  const nCr = (n, r) => {
    if (r > n) return 0;
    return fact(n) / (fact(r) * fact(n - r));
  };

  useEffect(() => {
    calculateProbability();
  }, [trials, probSuccess, successes]);

  const calculateProbability = () => {
    const n = parseInt(trials);
    const p = parseFloat(probSuccess);
    const k = parseInt(successes);

    if (isNaN(n) || isNaN(p) || isNaN(k) || n <= 0 || p < 0 || p > 1 || k < 0 || k > n) {
      setResult(null);
      return;
    }

    // Binomial Probability: P(X = k) = nCr * p^k * (1-p)^(n-k)
    const exactProb = nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    
    // Cumulative probabilities
    let probAtMost = 0; // P(X <= k)
    for (let i = 0; i <= k; i++) {
        probAtMost += nCr(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
    }
    
    let probAtLeast = 0; // P(X >= k)
    for (let i = k; i <= n; i++) {
        probAtLeast += nCr(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
    }

    const formatProb = (p) => (p * 100).toFixed(4) + '%';
    const numProb = (p) => p.toFixed(6);

    setResult({
        exact: { percent: formatProb(exactProb), num: numProb(exactProb) },
        atMost: { percent: formatProb(probAtMost), num: numProb(probAtMost) },
        atLeast: { percent: formatProb(probAtLeast), num: numProb(probAtLeast) }
    });

    if (n > 0) {
      addCalculation({
        type: 'Binomial Probability',
        summary: `P(X = ${k}): <b>${formatProb(exactProb)}</b> <br/> <span class="text-xs text-gray-500">n=${n}, p=${p}</span>`
      });
    }
  };

  return (
    <CalculatorLayout 
      title="Binomial Probability" 
      description="Calculate exact, at most, and at least probabilities for a binomial distribution."
      icon={Calculator}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        
        {/* Input Section */}
        <div className="card p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="label-text">Number of Trials (n)</label>
              <input 
                type="number" 
                min="1"
                step="1"
                className="input-field" 
                value={trials}
                onChange={(e) => setTrials(e.target.value)}
              />
            </div>
            
            <div>
              <label className="label-text flex justify-between">
                <span>Probability of Success (p)</span>
                <span className="text-gray-500 text-sm">Valid: 0 to 1</span>
              </label>
              <input 
                type="number" 
                min="0"
                max="1"
                step="0.01"
                className="input-field" 
                value={probSuccess}
                onChange={(e) => setProbSuccess(e.target.value)}
              />
            </div>

            <div>
              <label className="label-text flex justify-between">
                 <span>Number of Successes (k)</span>
                 <span className="text-gray-500 text-sm">Valid: 0 to {trials || 'n'}</span>
              </label>
              <input 
                type="number" 
                min="0"
                max={trials}
                step="1"
                className="input-field" 
                value={successes}
                onChange={(e) => setSuccesses(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
            {result ? (
                <div className="grid grid-rows-3 gap-4 h-full">
                    <div className="card p-6 flex flex-col justify-center bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 animate-fade-in">
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-1">Exact Probability: P(X = k)</span>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-gray-100">{result.exact.percent}</span>
                            <span className="text-gray-500 dark:text-gray-400 font-medium">{result.exact.num}</span>
                        </div>
                    </div>
                    
                    <div className="card p-6 flex flex-col justify-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">At Most: P(X ≤ k)</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{result.atMost.percent}</span>
                            <span className="text-gray-400 font-medium">{result.atMost.num}</span>
                        </div>
                    </div>

                    <div className="card p-6 flex flex-col justify-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">At Least: P(X ≥ k)</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{result.atLeast.percent}</span>
                            <span className="text-gray-400 font-medium">{result.atLeast.num}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card p-6 h-full flex items-center justify-center text-center text-gray-400">
                    <div>
                        <Calculator size={48} className="mx-auto opacity-20 mb-4" />
                        <p>Enter valid parameters (n, p, k) to calculate probability.</p>
                        <p className="text-xs mt-2 opacity-70">Note: p must be between 0 and 1, and k cannot exceed n.</p>
                    </div>
                </div>
            )}
        </div>

      </div>
    </CalculatorLayout>
  );
}
