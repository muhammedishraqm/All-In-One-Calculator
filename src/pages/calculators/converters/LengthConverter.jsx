import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { GitMerge, ArrowRightLeft } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

const UNITS = {
  mm: { name: 'Millimeters (mm)', factor: 0.001 },
  cm: { name: 'Centimeters (cm)', factor: 0.01 },
  m: { name: 'Meters (m)', factor: 1 },
  km: { name: 'Kilometers (km)', factor: 1000 },
  in: { name: 'Inches (in)', factor: 0.0254 },
  ft: { name: 'Feet (ft)', factor: 0.3048 },
  yd: { name: 'Yards (yd)', factor: 0.9144 },
  mi: { name: 'Miles (mi)', factor: 1609.344 },
};

export default function LengthConverter() {
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [inputValue, setInputValue] = useState('1');
  const [result, setResult] = useState(null);
  
  const { addCalculation } = useHistoryContext();

  useEffect(() => {
    calculateConversion();
  }, [inputValue, fromUnit, toUnit]);

  const calculateConversion = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult(null);
      return;
    }

    const valueInMeters = value * UNITS[fromUnit].factor;
    const finalValue = valueInMeters / UNITS[toUnit].factor;
    
    // Formatting: showing up to 6 decimal places, removing trailing zeros
    const formattedResult = parseFloat(finalValue.toFixed(6)).toString();
    setResult(formattedResult);

    if(value > 0){
        addCalculation({
            type: 'Length Conversion',
            summary: `<b>${value} ${fromUnit}</b> = <b class="text-primary-600">${formattedResult} ${toUnit}</b>`
        });
    }
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <CalculatorLayout 
      title="Length Converter" 
      description="Quickly convert between meters, feet, inches, and other units of distance."
      icon={GitMerge}
    >
      <div className="card p-6 md:p-10 max-w-4xl mx-auto mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* FROM Section */}
          <div className="flex-1 w-full space-y-4">
            <label className="label-text font-bold text-lg">From</label>
            <div className="relative">
              <input 
                type="number" 
                className="input-field text-2xl font-bold p-6 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 shadow-inner"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="0"
              />
            </div>
            <select 
              className="input-field cursor-pointer mt-2" 
              value={fromUnit} 
              onChange={(e) => setFromUnit(e.target.value)}
            >
              {Object.entries(UNITS).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          {/* SWAP Button */}
          <div className="flex-shrink-0 pt-8" onClick={handleSwap}>
            <button className="p-4 rounded-full bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-800/50 text-primary-600 dark:text-primary-400 transition-all transform hover:scale-110 active:scale-95 shadow-sm">
              <ArrowRightLeft size={24} className="md:rotate-0 rotate-90" />
            </button>
          </div>

          {/* TO Section */}
          <div className="flex-1 w-full space-y-4">
            <label className="label-text font-bold text-lg text-primary-600 dark:text-primary-400">To</label>
            <div className="relative">
              <input 
                type="text" 
                readOnly
                className="input-field text-2xl font-bold p-6 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-900/30"
                value={result !== null ? result : ''}
                placeholder="Result"
              />
            </div>
            <select 
              className="input-field cursor-pointer mt-2" 
              value={toUnit} 
              onChange={(e) => setToUnit(e.target.value)}
            >
              {Object.entries(UNITS).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
          
        </div>

        {/* Real-time Equation Display */}
        {result !== null && inputValue && (
            <div className="mt-12 text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl animate-fade-in">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Equation</p>
                <div className="text-xl md:text-3xl font-black text-gray-900 dark:text-gray-100 items-baseline flex flex-wrap justify-center gap-2">
                    <span>{inputValue}</span>
                    <span className="text-sm font-bold text-gray-400">{UNITS[fromUnit].name}</span>
                    <span className="text-primary-500 mx-2">=</span>
                    <span className="text-primary-600 dark:text-primary-400">{result}</span>
                    <span className="text-sm font-bold text-primary-400/70">{UNITS[toUnit].name}</span>
                </div>
            </div>
        )}
      </div>
    </CalculatorLayout>
  );
}
