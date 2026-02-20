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
import Vo2Max from './pages/calculators/health/Vo2Max';
import RunningPace from './pages/calculators/health/RunningPace';
import PregnancyDueDate from './pages/calculators/health/PregnancyDueDate';
import WaterTarget from './pages/calculators/health/WaterTarget';
import IdealWeight from './pages/calculators/health/IdealWeight';
import CalorieIntake from './pages/calculators/health/CalorieIntake';
import BodyFat from './pages/calculators/health/BodyFat';
import BMRCalculator from './pages/calculators/health/BMRCalculator';
import CompoundInterest from './pages/calculators/finance/CompoundInterest';
import HouseLoanEMI from './pages/calculators/finance/HouseLoanEMI';
import SIPReturns from './pages/calculators/finance/SIPReturns';
import CurrencyConverter from './pages/calculators/finance/CurrencyConverter';
import ROICalculator from './pages/calculators/finance/ROICalculator';
import XirrCalculator from './pages/calculators/finance/XirrCalculator';
import InflationAdjustedReturns from './pages/calculators/finance/InflationAdjustedReturns';
import FDI_IncomeTax from './pages/calculators/finance/FDI_IncomeTax';
import LoanAmortization from './pages/calculators/finance/LoanAmortization';
import ProbabilityCalculator from './pages/calculators/math/ProbabilityCalculator';
import StatisticsCalculator from './pages/calculators/math/StatisticsCalculator';
import EquationSolver from './pages/calculators/math/EquationSolver';
import LengthConverter from './pages/calculators/converters/LengthConverter';
import FractionSimplifier from './pages/calculators/math/FractionSimplifier';
import Combinations from './pages/calculators/math/Combinations';
import GcdLcm from './pages/calculators/math/GcdLcm';
import PercentChange from './pages/calculators/math/PercentChange';
import AgeCalculator from './pages/calculators/utilities/AgeCalculator';
import GSTCalculator from './pages/calculators/utilities/GSTCalculator';
import WordCounter from './pages/calculators/utilities/WordCounter';
import TipSplitter from './pages/calculators/utilities/TipSplitter';
import FuelExpenses from './pages/calculators/core/FuelExpenses';
import PasswordChecker from './pages/calculators/utilities/PasswordChecker';
import DateDifference from './pages/calculators/utilities/DateDifference';
import TimeCalculator from './pages/calculators/utilities/TimeCalculator';
import PaycheckEstimator from './pages/calculators/utilities/PaycheckEstimator';
import BasicCalculator from './pages/calculators/core/BasicCalculator';
import ScientificCalculator from './pages/calculators/core/ScientificCalculator';
import TimeZoneConverter from './pages/calculators/converters/TimeZoneConverter';
import RetirementSavings from './pages/calculators/finance/RetirementSavings';
import WeightConverter from './pages/calculators/converters/WeightConverter';
import TemperatureConverter from './pages/calculators/converters/TemperatureConverter';
import VolumeConverter from './pages/calculators/converters/VolumeConverter';
import SpeedConverter from './pages/calculators/converters/SpeedConverter';
import FuelEfficiencyConverter from './pages/calculators/converters/FuelEfficiencyConverter';
import AreaConverter from './pages/calculators/converters/AreaConverter';
function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <HistoryProvider>
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
                            <Route path="/health/vo2max" element={<Vo2Max />} />
                            <Route path="/health/pace" element={<RunningPace />} />
                            <Route path="/health/pregnancy" element={<PregnancyDueDate />} />
                            <Route path="/health/water" element={<WaterTarget />} />
                            <Route path="/health/ideal-weight" element={<IdealWeight />} />
                            <Route path="/health/calories" element={<CalorieIntake />} />
                            <Route path="/health/bodyfat" element={<BodyFat />} />
                            <Route path="/health/bmr" element={<BMRCalculator />} />
                            <Route path="/finance/compound-interest" element={<CompoundInterest />} />
                            <Route path="/finance/emi" element={<HouseLoanEMI />} />
                            <Route path="/finance/sip" element={<SIPReturns />} />
                            <Route path="/finance/currency" element={<CurrencyConverter />} />
                            <Route path="/finance/roi" element={<ROICalculator />} />
                            <Route path="/finance/xirr" element={<XirrCalculator />} />
                            <Route path="/finance/inflation" element={<InflationAdjustedReturns />} />
                            <Route path="/finance/fd-tax" element={<FDI_IncomeTax />} />
                            <Route path="/finance/amortization" element={<LoanAmortization />} />
                            <Route path="/math/probability" element={<ProbabilityCalculator />} />
                            <Route path="/math/statistics" element={<StatisticsCalculator />} />
                            <Route path="/math/equation" element={<EquationSolver />} />
                            <Route path="/math/fractions" element={<FractionSimplifier />} />
                            <Route path="/math/combinations" element={<Combinations />} />
                            <Route path="/math/gcd" element={<GcdLcm />} />
                            <Route path="/math/percentage" element={<PercentChange />} />
                            <Route path="/converters/length" element={<LengthConverter />} />
                            <Route path="/utilities/age" element={<AgeCalculator />} />
                            <Route path="/utilities/gst" element={<GSTCalculator />} />
                            <Route path="/utilities/words" element={<WordCounter />} />
                            <Route path="/utilities/tip" element={<TipSplitter />} />
                            <Route path="/core/fuel" element={<FuelExpenses />} />
                            <Route path="/utilities/password" element={<PasswordChecker />} />
                            <Route path="/utilities/date-diff" element={<DateDifference />} />
                            <Route path="/utilities/time" element={<TimeCalculator />} />
                            <Route path="/utilities/paycheck" element={<PaycheckEstimator />} />
                            <Route path="/core/basic" element={<BasicCalculator />} />
                            <Route path="/core/scientific" element={<ScientificCalculator />} />
                            <Route path="/converters/timezone" element={<TimeZoneConverter />} />
                            <Route path="/finance/retirement" element={<RetirementSavings />} />
                            <Route path="/converters/weight" element={<WeightConverter />} />
                            <Route path="/converters/temperature" element={<TemperatureConverter />} />
                            <Route path="/converters/volume" element={<VolumeConverter />} />
                            <Route path="/converters/speed" element={<SpeedConverter />} />
                            <Route path="/converters/fueleff" element={<FuelEfficiencyConverter />} />
                            <Route path="/converters/area" element={<AreaConverter />} />

                            {/* Dynamic Mapping for Unimplemented Routes */}
                            {CALCULATORS.filter(calc => ![
                                '/health/bmi',
                                '/health/vo2max',
                                '/health/pace',
                                '/health/pregnancy',
                                '/health/water',
                                '/health/ideal-weight',
                                '/health/calories',
                                '/health/bodyfat',
                                '/health/bmr',
                                '/finance/compound-interest',
                                '/finance/emi',
                                '/finance/sip',
                                '/finance/currency',
                                '/finance/roi',
                                '/finance/xirr',
                                '/finance/inflation',
                                '/finance/fd-tax',
                                '/finance/amortization',
                                '/math/probability',
                                '/math/statistics',
                                '/math/equation',
                                '/math/fractions',
                                '/math/combinations',
                                '/math/gcd',
                                '/math/percentage',
                                '/converters/length',
                                '/utilities/age',
                                '/utilities/gst',
                                '/utilities/words',
                                '/utilities/tip',
                                '/core/fuel',
                                '/utilities/password',
                                '/utilities/date-diff',
                                '/utilities/time',
                                '/utilities/paycheck',
                                '/core/basic',
                                '/core/scientific',
                                '/converters/timezone',
                                '/finance/retirement',
                                '/converters/weight',
                                '/converters/temperature',
                                '/converters/volume',
                                '/converters/speed',
                                '/converters/fueleff',
                                '/converters/area'
                            ].includes(calc.path)).map((calc) => (
                                <Route 
                                    key={calc.id} 
                                    path={calc.path} 
                                    element={<ComingSoon title={calc.name} description={calc.description} icon={calc.icon} />} 
                                />
                            ))}

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </HistoryProvider>
    );
}

export default App;
