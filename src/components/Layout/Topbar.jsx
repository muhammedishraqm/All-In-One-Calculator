import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Sun, Moon, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import HistoryPanel from './HistoryPanel';
import { useHistoryContext } from '../../context/HistoryContext';
import { CALCULATORS } from '../../utils/calculators';

export default function Topbar({ onMenuClick }) {
    const { theme, toggleTheme } = useDarkMode();
    const { history, clearHistory } = useHistoryContext();
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const q = searchQuery.toLowerCase();
        const results = CALCULATORS.filter(calc =>
            calc.name.toLowerCase().includes(q) ||
            calc.keywords.some(k => k.toLowerCase().includes(q))
        ).slice(0, 5);
        setSearchResults(results);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectCalculator = (calc) => {
        navigate(calc.path);
        setSearchQuery('');
        setIsSearchFocused(false);
    };

    return (
        <>
            <header className="sticky top-0 z-30 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-16 w-full flex items-center justify-between px-4 lg:px-8 transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30"
                        onClick={onMenuClick}
                    >
                        <Menu size={24} />
                    </button>

                    <div ref={searchRef} className="relative hidden sm:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search 50+ calculators..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                className="pl-10 pr-4 py-2 w-64 lg:w-96 bg-gray-100 dark:bg-gray-800/50 border border-transparent focus:border-primary-500/50 focus:bg-white dark:focus:bg-gray-800 rounded-full text-sm outline-none transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-inner group-focus-within:shadow-primary-500/10"
                            />
                        </div>

                        {/* Search Dropdown */}
                        {isSearchFocused && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-slide-in origin-top">
                                {searchResults.map(result => (
                                    <button
                                        key={result.id}
                                        className="w-full text-left px-4 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm flex flex-col"
                                        onClick={() => handleSelectCalculator(result)}
                                    >
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">{result.name}</span>
                                        <span className="text-xs text-primary-600 dark:text-primary-400">{result.category}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {isSearchFocused && searchQuery && searchResults.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-4 text-center text-sm text-gray-500">
                                No calculators found.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        className="p-2.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all active:scale-95"
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button
                        className="relative p-2.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all active:scale-95"
                        onClick={() => setIsHistoryOpen(true)}
                        aria-label="View history"
                    >
                        <History size={20} />
                        {history.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Search - Visible only on small screens */}
            <div className="sm:hidden px-4 py-3 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 relative z-20">
                <div className="relative group w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full text-sm outline-none text-gray-900 dark:text-gray-100"
                    />
                </div>
                {isSearchFocused && searchResults.length > 0 && (
                    <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                        {searchResults.map(result => (
                            <button
                                key={result.id}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm border-b border-gray-100 dark:border-gray-700 last:border-0"
                                onClick={() => handleSelectCalculator(result)}
                            >
                                <span className="block font-semibold text-gray-900 dark:text-gray-100">{result.name}</span>
                                <span className="block text-xs text-primary-600 dark:text-primary-400 mt-0.5">{result.category}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <HistoryPanel
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={history}
                onClear={clearHistory}
            />
        </>
    );
}
