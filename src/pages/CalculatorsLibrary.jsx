import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CALCULATORS, CATEGORIES } from '../utils/calculators';
import { Activity, Landmark, Calculator, GitMerge, ArrowRight, Search, Grid } from 'lucide-react';
import clsx from 'clsx';

const ICONS = {
  [CATEGORIES.HEALTH]: Activity,
  [CATEGORIES.FINANCE]: Landmark,
  [CATEGORIES.MATH]: Calculator,
  [CATEGORIES.CONVERTERS]: GitMerge,
};

export default function CalculatorsLibrary() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalculators = CALCULATORS.filter((calc) => {
    const matchesCategory = activeCategory === 'All' || calc.category === activeCategory;
    const matchesSearch = calc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          calc.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...Object.values(CATEGORIES)];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 flex items-center gap-3">
              <Grid className="text-primary-500" size={32} />
              Calculators Library
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Browse and access all our specialized calculators.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-2xl outline-none transition-all text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                "px-4 py-2 text-sm font-semibold rounded-xl transition-all",
                activeCategory === cat 
                  ? "bg-primary-500 text-white shadow-md shadow-primary-500/20" 
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredCalculators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCalculators.map((calc, idx) => {
             const Icon = ICONS[calc.category] || Calculator;
             return (
              <NavLink 
                key={calc.id} 
                to={calc.path}
                className="group card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                style={{ animationDelay: `${(idx % 10) * 50}ms` }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500 transform -translate-y-4 translate-x-4">
                  <Icon size={120} />
                </div>
                
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600 dark:text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                      {calc.category}
                    </span>
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
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl">
          <Search size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No calculators found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            We couldn't find any calculators matching your search or selected category.
          </p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="mt-6 btn-secondary text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
