import React from 'react';
import { NavLink } from 'react-router-dom';
import { CATEGORIES, CALCULATORS } from '../../utils/calculators';
import { Activity, Landmark, Calculator, GitMerge, X, Grid, Settings } from 'lucide-react';
import clsx from 'clsx';

const ICONS = {
    [CATEGORIES.CORE]: Grid,
    [CATEGORIES.HEALTH]: Activity,
    [CATEGORIES.FINANCE]: Landmark,
    [CATEGORIES.MATH]: Calculator,
    [CATEGORIES.CONVERTERS]: GitMerge,
    [CATEGORIES.UTILITIES]: Settings,
};

export default function Sidebar({ isOpen, onClose }) {
    // Group categories
    const categoriesMap = Object.values(CATEGORIES).map(cat => ({
        name: cat,
        calculators: CALCULATORS.filter(c => c.category === cat)
    })).filter(cat => cat.calculators.length > 0);

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Content */}
            <aside
                className={clsx(
                    "fixed top-0 left-0 h-full w-72 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex flex-col shadow-xl md:shadow-none",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
                    <NavLink to="/" className="flex items-center gap-3 text-xl font-bold tracking-tight text-primary-600 dark:text-primary-400 group">
                        <div className="bg-primary-500 text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-md shadow-primary-500/20">
                            <Calculator size={20} />
                        </div>
                        <span>OmniCalc</span>
                    </NavLink>
                    <button
                        className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-8 no-scrollbar pb-24">
                    <div className="space-y-1 mb-8">
                        <NavLink
                            to="/library"
                            onClick={() => {
                                if (window.innerWidth < 768) onClose();
                            }}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            <Grid size={18} />
                            Calculators Library
                        </NavLink>
                    </div>

                    {categoriesMap.map((catGroup, idx) => {
                        const GroupIcon = ICONS[catGroup.name] || Calculator;
                        return (
                            <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                                <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-gray-800 dark:text-gray-200 mb-4 px-2 mt-6 first:mt-0">
                                    <GroupIcon size={16} className="text-primary-500" />
                                    {catGroup.name}
                                </h3>
                                <div className="space-y-1">
                                    {catGroup.calculators.map(calc => (
                                        <NavLink
                                            key={calc.id}
                                            to={calc.path}
                                            onClick={() => {
                                                if (window.innerWidth < 768) onClose();
                                            }}
                                            className={({ isActive }) => clsx(
                                                "flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                                                isActive
                                                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            )}
                                        >
                                            {calc.name}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>
        </>
    );
}
