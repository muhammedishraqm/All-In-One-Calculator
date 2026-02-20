import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Layout/Topbar';
import Sidebar from './components/Layout/Sidebar';
import { HistoryProvider } from './context/HistoryContext';
import { CALCULATORS } from './utils/calculators';

import Home from './pages/Home';
import CalculatorsLibrary from './pages/CalculatorsLibrary';
import ComingSoon from './components/Layout/ComingSoon';

// Specific Implementations
import BMI from './pages/calculators/health/BMI';
import CompoundInterest from './pages/calculators/finance/CompoundInterest';
import HouseLoanEMI from './pages/calculators/finance/HouseLoanEMI';
import SIPReturns from './pages/calculators/finance/SIPReturns';
import LoanAmortization from './pages/calculators/finance/LoanAmortization';
import ProbabilityCalculator from './pages/calculators/math/ProbabilityCalculator';
import StatisticsCalculator from './pages/calculators/math/StatisticsCalculator';
import EquationSolver from './pages/calculators/math/EquationSolver';
import LengthConverter from './pages/calculators/converters/LengthConverter';
import AgeCalculator from './pages/calculators/utilities/AgeCalculator';
import GSTCalculator from './pages/calculators/utilities/GSTCalculator';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <HistoryProvider>
            <Router>
                <div className="flex h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 overflow-hidden font-sans selection:bg-primary-500/30">
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

                        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 scroll-smooth">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/library" element={<CalculatorsLibrary />} />
                                {/* Explicit Routes */}
                                <Route path="/health/bmi" element={<BMI />} />
                                <Route path="/finance/compound-interest" element={<CompoundInterest />} />
                                <Route path="/finance/emi" element={<HouseLoanEMI />} />
                                <Route path="/finance/sip" element={<SIPReturns />} />
                                <Route path="/finance/amortization" element={<LoanAmortization />} />
                                <Route path="/math/probability" element={<ProbabilityCalculator />} />
                                <Route path="/math/statistics" element={<StatisticsCalculator />} />
                                <Route path="/math/equation" element={<EquationSolver />} />
                                <Route path="/converters/length" element={<LengthConverter />} />
                                <Route path="/utilities/age" element={<AgeCalculator />} />
                                <Route path="/utilities/gst" element={<GSTCalculator />} />

                                {/* Dynamic Mapping for Unimplemented Routes */}
                                {CALCULATORS.filter(calc => ![
                                    '/health/bmi',
                                    '/finance/compound-interest',
                                    '/finance/emi',
                                    '/finance/sip',
                                    '/finance/amortization',
                                    '/math/probability',
                                    '/math/statistics',
                                    '/math/equation',
                                    '/converters/length',
                                    '/utilities/age',
                                    '/utilities/gst'
                                ].includes(calc.path)).map((calc) => (
                                    <Route 
                                        key={calc.id} 
                                        path={calc.path} 
                                        element={<ComingSoon title={calc.name} description={calc.description} />} 
                                    />
                                ))}

                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            </Router>
        </HistoryProvider>
    );
}

export default App;
