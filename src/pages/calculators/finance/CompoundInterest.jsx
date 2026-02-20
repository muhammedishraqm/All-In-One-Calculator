import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Landmark } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState('10000');
  const [contribution, setContribution] = useState('500');
  const [rate, setRate] = useState('8');
  const [years, setYears] = useState('10');
  
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState(null);
  const { addCalculation } = useHistoryContext();

  useEffect(() => {
    calculateCompoundInterest();
  }, [principal, contribution, rate, years]);

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal) || 0;
    const pmt = parseFloat(contribution) || 0;
    const r = parseFloat(rate) / 100 || 0;
    const t = parseInt(years) || 0;

    if (t <= 0) {
      setChartData([]);
      setSummary(null);
      return;
    }

    let currentBalance = p;
    let totalContributions = p;
    const data = [];

    for (let i = 0; i <= t; i++) {
        if (i === 0) {
            data.push({
                year: i,
                balance: Math.round(currentBalance),
                contributions: Math.round(totalContributions),
                interest: 0
            });
            continue;
        }

        // Add yearly contribution (assuming start of year for simplicity here)
        // More complex would use monthly intervals matching PMT
        const yearlyContribution = pmt * 12;
        currentBalance += yearlyContribution;
        totalContributions += yearlyContribution;

        // Apply interest
        currentBalance *= (1 + r);
        
        data.push({
            year: i,
            balance: Math.round(currentBalance),
            contributions: Math.round(totalContributions),
            interest: Math.round(currentBalance - totalContributions)
        });
    }

    setChartData(data);
    
    if (data.length > 0) {
        const finalYear = data[data.length - 1];
        setSummary({
            totalBalance: finalYear.balance,
            totalInterest: finalYear.interest,
            totalContributions: finalYear.contributions
        });

        addCalculation({
            type: 'Compound Interest',
            summary: `Total Balance: <b>$${finalYear.balance.toLocaleString()}</b> <br/> <span class="text-xs text-gray-500">Principal: $${p}, PMT: $${pmt}/mo, ${t} Yrs</span>`
        });
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <CalculatorLayout 
      title="Compound Interest" 
      description="Calculate how your savings grow over time with compound interest."
      icon={Landmark}
      hasExport={true}
      onExport={() => alert('Exporting CI Data (Phase 1 stub)')}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-6">
        
        {/* Input Section */}
        <div className="xl:col-span-4 card p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="label-text flex justify-between">
                <span>Initial Principal ($)</span>
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
                <span>Monthly Contribution ($)</span>
                <span className="text-primary-600 dark:text-primary-400 font-bold">{formatCurrency(contribution || 0)}</span>
              </label>
              <input 
                type="number" 
                className="input-field" 
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
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
                <span>Years to Grow</span>
                <span className="text-primary-600 dark:text-primary-400 font-bold">{years || 0} yrs</span>
              </label>
              <input 
                type="number" 
                className="input-field" 
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Result & Chart Section */}
        <div className="xl:col-span-8 space-y-6">
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="card p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(summary.totalBalance)}</span>
                    </div>
                    <div className="card p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contributions</span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(summary.totalContributions)}</span>
                    </div>
                    <div className="card p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Interest earned</span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(summary.totalInterest)}</span>
                    </div>
                </div>
            )}

            <div className="card p-6 min-h-[400px]">
                <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">Growth Projection</h3>
                {chartData.length > 0 ? (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} tick={{fill: '#6b7280'}} />
                                <Tooltip 
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                                <Line type="monotone" dataKey="balance" name="Total Balance" stroke="#14b8a6" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="contributions" name="Total Contributions" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                <Line type="monotone" dataKey="interest" name="Interest Earned" stroke="#10b981" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-80 flex items-center justify-center text-gray-400">
                        Enter valid numbers to see the projection
                    </div>
                )}
            </div>
        </div>

      </div>
    </CalculatorLayout>
  );
}
