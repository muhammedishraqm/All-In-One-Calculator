import React from 'react';
import { Download, History, Calculator } from 'lucide-react';

export default function CalculatorLayout({
    title,
    description,
    icon: Icon = Calculator,
    onExport,
    hasExport = false,
    children
}) {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-fade-in w-full">
            {/* Header section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-2xl shadow-sm border border-primary-200/50 dark:border-primary-800/50">
                        <Icon size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">{title}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xl">{description}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    {hasExport && (
                        <button
                            onClick={onExport}
                            className="btn-secondary"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
