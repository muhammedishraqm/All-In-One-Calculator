import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Landmark } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#14b8a6', '#f43f5e'];

export default function HouseLoanEMI() {
  const [principal, setPrincipal] = useState('5000000');
  const [rate, setRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('20');
  
  const [result, setResult] = useState(null);
  const { addCalculation } = useHistoryContext();

  useEffect(() => {
    calculateEMI();
  }, [principal, rate, tenureYears]);

  const calculateEMI = () => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const years = parseFloat(tenureYears);

    if (!P || !annualRate || !years || P <= 0 || annualRate <= 0 || years <= 0) {
      setResult(null);
      return;
    }

    const r = (annualRate / 12) / 100; // Monthly interest rate
    const n = years * 12; // Total number of months

    // emi = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    const data = [
      { name: 'Principal Amount', value: P },
      { name: 'Total Interest', value: totalInterest }
    ];

    setResult({
      emi,
      totalInterest,
      totalAmount,
      principal: P,
      data
    });

    if (P > 0) {
      addCalculation({
        type: 'House Loan EMI',
        summary: `EMI: <b>${formatCurrency(emi)}/mo</b> <br/> <span class="text-xs text-gray-500">Loan: ${formatCurrency(P)}</span>`
      });
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  return (
    <CalculatorLayout 
      title="House Loan EMI" 
      description="Calculate your Equated Monthly Installment (EMI) for a house loan."
      icon={Landmark}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Input Section */}
        <div className="lg:col-span-5 card p-6 space-y-6">
          <div className="space-y-6">
            <div>
              <label className="label-text flex justify-between">
                <span>Loan Amount</span>
                <span className="text-primary-600 dark:text-primary-400 font-bold">{formatCurrency(principal || 0)}</span>
              </label>
              <input 
                type="number" 
                className="input-field" 
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
            </div>
            
            <div>
              <label className="label-text flex justify-between">
                <span>Annual Interest Rate (%)</span>
                <span className="text-primary-600 dark:text-primary-400 font-bold">{rate || 0}%</span>
              </label>
              <input 
                type="number" 
                className="input-field" 
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>

            <div>
              <label className="label-text flex justify-between">
                <span>Loan Tenure (Years)</span>
                <span className="text-primary-600 dark:text-primary-400 font-bold">{tenureYears || 0} Yrs</span>
              </label>
              <input 
                type="number" 
                className="input-field" 
                value={tenureYears}
                onChange={(e) => setTenureYears(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Result & Chart Section */}
        <div className="lg:col-span-7 space-y-6">
            {result ? (
                <>
                    <div className="card p-6 bg-primary-50 dark:bg-primary-900/20 text-center animate-fade-in">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Loan EMI</span>
                        <div className="text-4xl lg:text-5xl font-black text-primary-600 dark:text-primary-400 mt-2">
                           {formatCurrency(result.emi)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card p-6 flex flex-col justify-center space-y-4">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Principal Amount</span>
                                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(result.principal)}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Total Interest</span>
                                <span className="text-xl font-bold text-rose-500 dark:text-rose-400">{formatCurrency(result.totalInterest)}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Total Amount Payable</span>
                                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(result.totalAmount)}</span>
                            </div>
                        </div>

                        <div className="card p-6 min-h-[250px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={result.data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {result.data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            ) : (
                <div className="card p-6 min-h-[300px] flex items-center justify-center text-gray-400">
                    Enter valid numbers to calculate EMI
                </div>
            )}
        </div>

      </div>
    </CalculatorLayout>
  );
}
