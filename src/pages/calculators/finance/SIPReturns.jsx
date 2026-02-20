import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Landmark } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SIPReturns() {
  const [monthlyInvestment, setMonthlyInvestment] = useState('5000');
  const [returnRate, setReturnRate] = useState('12');
  const [timePeriod, setTimePeriod] = useState('10');
  
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState(null);
  const { addCalculation } = useHistoryContext();

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, returnRate, timePeriod]);

  const calculateSIP = () => {
    const P = parseFloat(monthlyInvestment);
    const expectedRate = parseFloat(returnRate);
    const years = parseFloat(timePeriod);

    if (!P || !expectedRate || !years || P <= 0 || expectedRate <= 0 || years <= 0) {
      setChartData([]);
      setSummary(null);
      return;
    }

    const n = years * 12; // total months
    const i = expectedRate / 12 / 100; // monthly rate

    // FV = P * ((1 + i)^n - 1) / i * (1 + i)
    let totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    let totalInvested = P * n;
    let estimatedReturns = totalValue - totalInvested;

    const data = [];
    let currentInvestment = 0;
    
    // Generate data per year for the chart
    for (let yr = 1; yr <= years; yr++) {
        const months = yr * 12;
        currentInvestment = P * months;
        let futureValueYear = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
        
        data.push({
            year: `Year ${yr}`,
            Invested: Math.round(currentInvestment),
            Returns: Math.round(futureValueYear - currentInvestment),
            Total: Math.round(futureValueYear)
        });
    }

    setChartData(data);
    setSummary({
      totalInvested: totalInvested,
      estimatedReturns: estimatedReturns,
      totalValue: totalValue
    });

    if (P > 0) {
      addCalculation({
        type: 'SIP Returns',
        summary: `Value: <b>${formatCurrency(totalValue)}</b> <br/> <span class="text-xs text-gray-500">Invested: ${formatCurrency(totalInvested)}</span>`
      });
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  return (
    <CalculatorLayout 
      title="SIP Returns Calculator" 
      description="Estimate the future value of your monthly SIP investments."
      icon={Landmark}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Input Section */}
        <div className="lg:col-span-4 card p-6 space-y-6">
          <div className="space-y-6">
            <div>
              <label className="label-text flex justify-between">
                <span>Monthly Investment</span>
                <span className="text-primary-600 dark:text-primary-400 font-bold">{formatCurrency(monthlyInvestment || 0)}</span>
              </label>
              <input 
                type="number" 
                className="input-field" 
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(e.target.value)}
              />
            </div>
            
            <div>
              <label className="label-text flex justify-between">
                <span>Expected Return Rate (p.a)</span>
                <span className="text-green-600 dark:text-green-400 font-bold">{returnRate || 0}%</span>
              </label>
              <input 
                type="number" 
                className="input-field" 
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
              />
            </div>

            <div>
              <label className="label-text flex justify-between">
                <span>Time Period</span>
                <span className="text-primary-600 dark:text-primary-400 font-bold">{timePeriod || 0} Years</span>
              </label>
              <input 
                type="number" 
                className="input-field" 
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Result & Chart Section */}
        <div className="lg:col-span-8 space-y-6">
            {summary ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Invested</span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(summary.totalInvested)}</span>
                        </div>
                        <div className="card p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Est. Returns</span>
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(summary.estimatedReturns)}</span>
                        </div>
                        <div className="card p-4 flex flex-col items-center justify-center text-center bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">Total Value</span>
                            <span className="text-3xl font-black text-primary-700 dark:text-primary-300">{formatCurrency(summary.totalValue)}</span>
                        </div>
                    </div>

                    <div className="card p-6 min-h-[400px]">
                        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">Investment Growth Over Time</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                    <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{fill: '#6b7280'}} dy={10} />
                                    <YAxis tickFormatter={(value) => `₹${value/100000}L`} tickLine={false} axisLine={false} tick={{fill: '#6b7280'}} />
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                                    <Area type="monotone" dataKey="Invested" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInvested)" />
                                    <Area type="monotone" dataKey="Returns" stroke="#10b981" fillOpacity={1} fill="url(#colorReturns)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            ) : (
                <div className="card p-6 min-h-[300px] flex items-center justify-center text-gray-400">
                    Enter valid numbers to calculate SIP Growth
                </div>
            )}
        </div>

      </div>
    </CalculatorLayout>
  );
}
