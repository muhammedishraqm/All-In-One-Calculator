import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HistoryProvider } from './context/HistoryContext';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import Home from './pages/Home';
import CalculatorsLibrary from './pages/CalculatorsLibrary';
import BMI from './pages/calculators/health/BMI';
import CompoundInterest from './pages/calculators/finance/CompoundInterest';
import LengthConverter from './pages/calculators/converters/LengthConverter';

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
                            <Route path="/health/bmi" element={<BMI />} />
                            <Route path="/finance/compound-interest" element={<CompoundInterest />} />
                            <Route path="/converters/length" element={<LengthConverter />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </HistoryProvider>
    );
}

export default App;
