import React from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Settings, Wrench } from 'lucide-react';

export default function ComingSoon({ title, description, icon: Icon = Settings }) {
  return (
    <CalculatorLayout 
      title={title} 
      description={description}
      icon={Icon}
    >
      <div className="card p-12 mt-6 flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-surface-dark border border-gray-100 dark:border-gray-800">
        
        <div className="relative mb-2">
            <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-full shadow-inner">
                <Icon size={80} strokeWidth={1.5} className="text-primary-500 dark:text-primary-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white p-3 rounded-full shadow-xl shadow-yellow-500/20 animate-bounce">
                <Wrench size={24} />
            </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-4">Currently in Development</h2>
        
        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
          The <strong>{title}</strong> is being built and tested. 
          We are adding over 40 precise calculators completely free and ad-free. Check back soon for this fully functional tool!
        </p>

        <div className="pt-8 w-full border-t border-gray-100 dark:border-gray-800">
             <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 animate-pulse">
                <div className="bg-primary-600 h-2.5 rounded-full w-[45%]"></div>
            </div>
             <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 font-mono font-medium tracking-widest uppercase">Building UI & Math Engine...</p>
        </div>

      </div>
    </CalculatorLayout>
  );
}
