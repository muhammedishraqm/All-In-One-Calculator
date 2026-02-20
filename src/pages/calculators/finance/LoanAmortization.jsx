import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Landmark } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function LoanAmortization() {
  const [principal, setPrincipal] = useState('1000000');
  const [rate, setRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('5');
  
  const [schedule, setSchedule] = useState([]);
  const [summary, setSummary] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;

  const { addCalculation } = useHistoryContext();

  useEffect(() => {
    calculateAmortization();
    setPage(1);
  }, [principal, rate, tenureYears]);

  const calculateAmortization = () => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const years = parseFloat(tenureYears);

    if (!P || !annualRate || !years || P <= 0 || annualRate <= 0 || years <= 0) {
      setSchedule([]);
      setSummary(null);
      return;
    }

    const r = (annualRate / 12) / 100; // Monthly interest rate
    const n = Math.ceil(years * 12); // Total number of months

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    let balance = P;
    let totalInterest = 0;
    const data = [];

    for (let month = 1; month <= n; month++) {
      let interest = balance * r;
      let principalPaying = emi - interest;
      
      // Adjust last month rounding issues
      if (month === n) {
        principalPaying = balance;
        interest = balance * r;
      }

      totalInterest += interest;
      balance -= principalPaying;
      if (balance < 0) balance = 0;

      data.push({
        month,
        emi: month === n ? (principalPaying + interest) : emi,
        principal: principalPaying,
        interest: interest,
        balance: balance
      });
    }

    setSchedule(data);
    setSummary({
      emi,
      totalInterest,
      totalAmount: P + totalInterest
    });

    if (P > 0) {
      addCalculation({
        type: 'Loan Amortization',
        summary: `EMI: <b>${formatCurrency(emi)}/mo</b> <br/> <span class="text-xs text-gray-500">Loan: ${formatCurrency(P)}</span>`
      });
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  // Pagination Logic
  const totalPages = Math.ceil(schedule.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const currentRows = schedule.slice(startIndex, startIndex + rowsPerPage);

  return (
    <CalculatorLayout 
      title="Loan Amortization Schedule" 
      description="View a month-by-month breakdown of your loan repayment including principal and interest components."
      icon={Landmark}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Input Section */}
        <div className="lg:col-span-4 card p-6 space-y-6 self-start">
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

          {summary && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 font-semibold">
                      <span className="text-gray-500 dark:text-gray-400">Monthly EMI</span>
                      <span className="text-primary-600 dark:text-primary-400">{formatCurrency(summary.emi)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 font-semibold">
                      <span className="text-gray-500 dark:text-gray-400">Total Interest</span>
                      <span className="text-rose-500 dark:text-rose-400">{formatCurrency(summary.totalInterest)}</span>
                  </div>
              </div>
          )}
        </div>

        {/* Schedule Table Section */}
        <div className="lg:col-span-8 space-y-4">
            {schedule.length > 0 ? (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Month</th>
                                    <th scope="col" className="px-6 py-4">EMI</th>
                                    <th scope="col" className="px-6 py-4 text-rose-500 dark:text-rose-400">Interest Paid</th>
                                    <th scope="col" className="px-6 py-4 text-green-600 dark:text-green-400">Principal Paid</th>
                                    <th scope="col" className="px-6 py-4">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((row) => (
                                    <tr key={row.month} className="bg-white dark:bg-surface-dark border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white border-r dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">{row.month}</td>
                                        <td className="px-6 py-4">{formatCurrency(row.emi)}</td>
                                        <td className="px-6 py-4">{formatCurrency(row.interest)}</td>
                                        <td className="px-6 py-4">{formatCurrency(row.principal)}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(row.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Context */}
                    {totalPages > 1 && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Page {page} of {totalPages}
                            </span>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-50 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="card p-6 min-h-[300px] flex items-center justify-center text-gray-400">
                    Enter valid numbers to view the amortization schedule
                </div>
            )}
        </div>

      </div>
    </CalculatorLayout>
  );
}
