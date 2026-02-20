import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Settings } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [compareDate, setCompareDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState(null);
  
  const { addCalculation } = useHistoryContext();

  useEffect(() => {
    calculateAge();
  }, [birthDate, compareDate]);

  const calculateAge = () => {
    if (!birthDate || !compareDate) {
      setResult(null);
      return;
    }

    const bDay = new Date(birthDate);
    const cDay = new Date(compareDate);

    if (isNaN(bDay.getTime()) || isNaN(cDay.getTime()) || cDay < bDay) {
      setResult(null);
      return;
    }

    // Exact years, months, days logic
    let years = cDay.getFullYear() - bDay.getFullYear();
    let months = cDay.getMonth() - bDay.getMonth();
    let days = cDay.getDate() - bDay.getDate();

    if (days < 0) {
      months -= 1;
      // Get days in the previous month of compare date
      const prevMonth = new Date(cDay.getFullYear(), cDay.getMonth(), 0).getDate();
      days += prevMonth;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffTime = Math.abs(cDay - bDay);
    const diffDaysTotal = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Total breakdown
    const totalMonths = (years * 12) + months;
    const totalWeeks = Math.floor(diffDaysTotal / 7);

    setResult({
        years, 
        months, 
        days,
        totalMonths,
        totalWeeks,
        diffDaysTotal
    });

    if (years > 0 || months > 0 || days > 0) {
      addCalculation({
        type: 'Age Calculator',
        summary: `Age: <b>${years}y, ${months}m, ${days}d</b> <br/> <span class="text-xs text-gray-500">DOB: ${birthDate}</span>`
      });
    }
  };

  return (
    <CalculatorLayout 
      title="Age Calculator" 
      description="Calculate exact age in years, months, days, and total days between two dates."
      icon={Settings}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        
        {/* Input Section */}
        <div className="card p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="label-text">Date of Birth</label>
              <input 
                type="date" 
                className="input-field" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="label-text">Compare To (Usually Today)</label>
              <input 
                 type="date" 
                 className="input-field" 
                 value={compareDate}
                 onChange={(e) => setCompareDate(e.target.value)}
              />
            </div>
            
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
            {result ? (
                <div className="card p-8 h-full flex flex-col justify-center animate-fade-in bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/10 dark:to-surface-dark border-primary-100 dark:border-primary-900/30 text-center">
                    
                     <span className="text-sm font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">Exact Age</span>
                     <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 items-center justify-center flex flex-wrap gap-2 md:gap-4 leading-tight mb-8">
                        <div>
                           {result.years} <span className="text-xl md:text-2xl text-gray-400 font-semibold tracking-normal">Years</span>
                        </div>
                        <div>
                           {result.months} <span className="text-xl md:text-2xl text-gray-400 font-semibold tracking-normal">Mos</span>
                        </div>
                        <div>
                           {result.days} <span className="text-xl md:text-2xl text-gray-400 font-semibold tracking-normal">Days</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-800 pt-6 mt-4">
                        <div className="flex flex-col">
                           <span className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-widest">Total Months</span>
                           <span className="text-xl font-bold text-gray-700 dark:text-gray-300">{result.totalMonths.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col border-x border-gray-100 dark:border-gray-800">
                           <span className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-widest">Total Weeks</span>
                           <span className="text-xl font-bold text-gray-700 dark:text-gray-300">{result.totalWeeks.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-widest">Total Days</span>
                           <span className="text-xl font-bold text-gray-700 dark:text-gray-300">{result.diffDaysTotal.toLocaleString()}</span>
                        </div>
                     </div>

                </div>
            ) : (
                <div className="card p-6 h-full flex items-center justify-center text-center text-gray-400">
                    <div>
                        <Settings size={48} className="mx-auto opacity-20 mb-4" />
                        <p>Select valid dates. The 'Compare To' date must be after 'DOB'.</p>
                    </div>
                </div>
            )}
        </div>

      </div>
    </CalculatorLayout>
  );
}
