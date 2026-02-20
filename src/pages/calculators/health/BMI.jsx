import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Activity } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function BMI() {
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
  const [weight, setWeight] = useState('');
  const [heightMode, setHeightMode] = useState('cm'); // 'cm' or 'ft-in' for imperial
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  
  const [result, setResult] = useState(null);
  const { addCalculation } = useHistoryContext();

  const calculateBMI = () => {
    let w = parseFloat(weight);
    let h; // in meters
    
    if (unit === 'metric') {
      h = parseFloat(heightCm) / 100;
      if (!w || !h || w <= 0 || h <= 0) return;
    } else {
      let ft = parseFloat(heightFt) || 0;
      let inch = parseFloat(heightIn) || 0;
      h = (ft * 12 + inch) * 0.0254; // convert inches to meters
      w = w * 0.453592; // map lbs to kg
      if (!w || !h || w <= 0 || h <= 0) return;
    }

    const bmiValue = (w / (h * h)).toFixed(1);
    
    let category = '';
    let colorClass = '';
    
    if (bmiValue < 18.5) {
      category = 'Underweight';
      colorClass = 'text-blue-500';
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      category = 'Normal Weight';
      colorClass = 'text-green-500';
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      category = 'Overweight';
      colorClass = 'text-yellow-500';
    } else {
      category = 'Obese';
      colorClass = 'text-red-500';
    }

    setResult({ value: bmiValue, category, colorClass });
    
    // Save to history
    addCalculation({
      type: 'BMI',
      summary: `Result: <b class="${colorClass}">${bmiValue} (${category})</b> <br/> <span class="text-xs text-gray-500">Weight: ${weight}${unit === 'metric'?'kg':'lbs'}</span>`
    });
  };

  useEffect(() => {
    calculateBMI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight, heightCm, heightFt, heightIn, unit]);

  const handleUnitToggle = (mode) => {
    setUnit(mode);
    setResult(null);
    setWeight('');
    setHeightCm('');
    setHeightFt('');
    setHeightIn('');
  };

  return (
    <CalculatorLayout 
      title="BMI Calculator" 
      description="Calculate your Body Mass Index quickly and accurately."
      icon={Activity}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        
        {/* Input Section */}
        <div className="card p-6 space-y-6">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
             <button 
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${unit === 'metric' ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                onClick={() => handleUnitToggle('metric')}
             >
                Metric
             </button>
             <button 
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${unit === 'imperial' ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                onClick={() => handleUnitToggle('imperial')}
             >
                Imperial
             </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label-text">
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input 
                type="number" 
                className="input-field" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={`e.g. ${unit === 'metric' ? '70' : '150'}`}
              />
            </div>
            
            {unit === 'metric' ? (
              <div>
                <label className="label-text">Height (cm)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="e.g. 175"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Height (ft)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <label className="label-text">Height (in)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    placeholder="e.g. 9"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result Section */}
        <div className="card p-6 flex flex-col items-center justify-center min-h-[300px] text-center bg-gray-50/50 dark:bg-gray-800/20">
          {result ? (
            <div className="animate-fade-in space-y-4">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Your BMI is</h3>
              <div className="text-6xl font-black text-gray-900 dark:text-gray-50">
                {result.value}
              </div>
              <div className={`text-xl font-bold px-4 py-2 rounded-full bg-opacity-20 dark:bg-opacity-10 inline-block ${result.colorClass.replace('text-', 'bg-')} ${result.colorClass}`}>
                {result.category}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mt-4">
                This is considered <strong className={result.colorClass}>{result.category.toLowerCase()}</strong> for adult men and women.
              </p>
            </div>
          ) : (
             <div className="text-gray-400 flex flex-col items-center">
                <Activity size={48} className="opacity-20 mb-4" />
                <p>Enter your details to see the result</p>
             </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
