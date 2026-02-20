import React from 'react';
import { NavLink } from 'react-router-dom';
import { CALCULATORS, CATEGORIES } from '../utils/calculators';
import { Activity, Landmark, Calculator, GitMerge, ArrowRight, Sparkles } from 'lucide-react';

const ICONS = {
    [CATEGORIES.HEALTH]: Activity,
    [CATEGORIES.FINANCE]: Landmark,
    [CATEGORIES.MATH]: Calculator,
    [CATEGORIES.CONVERTERS]: GitMerge,
};

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-12">
            {/* Hero Section */}
            <section className="text-center py-12 md:py-20 px-4 card bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-surface-dark border-primary-100 dark:border-primary-900/30 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center justify-center p-4 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-3xl shadow-lg shadow-primary-500/10 mb-4 transform -rotate-6">
                        <Calculator size={48} />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-50 tracking-tight">
                        The Only <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-400">Calculator</span> You Need.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                        Over 50+ specialized calculators for health, finance, exact mathematics, and conversions.
                        Lightning fast and works fully offline.
                    </p>
                </div>
                {/* Background blobs */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/20 blur-3xl rounded-full" />
                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-400/20 blur-3xl rounded-full" />
            </section>

            {/* AI Builder Banner */}
            <section className="px-4 md:px-0">
                <NavLink to="/ai-builder" className="group block relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-r from-indigo-900 to-purple-900 shadow-xl border border-indigo-500/30 transition-all hover:shadow-purple-500/20 hover:-translate-y-1">
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent transform skew-x-12 translate-x-1/2 group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
                        <div className="space-y-4 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold tracking-widest uppercase mb-2">
                                <Sparkles size={14} className="text-purple-300" />
                                New Feature
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black">Can't find what you need?</h2>
                            <p className="text-indigo-200 text-lg">
                                Describe any custom calculator you want, and our AI will build it, style it, and add it to your library instantly.
                            </p>
                        </div>
                        <div className="flex-shrink-0 animate-pulse-slow">
                            <div className="bg-white text-indigo-900 hover:bg-indigo-50 px-8 py-4 rounded-2xl font-black shadow-lg shadow-black/20 group-hover:scale-105 transition-transform flex items-center gap-2">
                                Build with AI <ArrowRight size={20} />
                            </div>
                        </div>
                    </div>
                </NavLink>
            </section>

            {/* Categories Grid */}
            <section className="px-4 md:px-0 space-y-16">
                {Object.values(CATEGORIES).map((catName) => {
                    const categoryCalculators = CALCULATORS.filter(c => c.category === catName);
                    if (categoryCalculators.length === 0) return null;
                    const GroupIcon = ICONS[catName] || Calculator;

                    return (
                        <div key={catName}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-primary-500">
                                    <GroupIcon size={24} />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">{catName}</h2>
                                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {categoryCalculators.map((calc, idx) => {
                                    const Icon = calc.icon || Calculator;
                                    return (
                                        <NavLink
                                            key={calc.id}
                                            to={calc.path}
                                            className="group card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-500 transform -translate-y-4 translate-x-4">
                                                <Icon size={120} />
                                            </div>
                                            <div className="relative z-10 flex flex-col h-full flex-1">
                                                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit text-gray-700 dark:text-gray-300 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                                                    <Icon size={24} />
                                                </div>
                                                <div className="mt-6 flex-1">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{calc.name}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{calc.description}</p>
                                                </div>
                                                <div className="mt-6 flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                                    Open Calculator <ArrowRight size={16} className="ml-1" />
                                                </div>
                                            </div>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}
