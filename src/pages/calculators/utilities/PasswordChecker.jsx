import React, { useState, useMemo, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Lock, ShieldCheck, ShieldAlert, KeyRound, EyeOff, Eye } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function PasswordChecker() {
    const { addCalculation } = useHistoryContext();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const checkStrength = (pwd) => {
        let score = 0;
        const checks = {
            length: pwd.length >= 12,
            lower: /[a-z]/.test(pwd),
            upper: /[A-Z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            symbol: /[^a-zA-Z0-9]/.test(pwd),
        };

        if (pwd.length > 0) score += 10;
        if (pwd.length >= 8) score += 10;
        if (checks.length) score += 20;

        if (checks.lower) score += 10;
        if (checks.upper) score += 15;
        if (checks.number) score += 15;
        if (checks.symbol) score += 20;

        // Entropy estimation logic (simple)
        let pool = 0;
        if (checks.lower) pool += 26;
        if (checks.upper) pool += 26;
        if (checks.number) pool += 10;
        if (checks.symbol) pool += 32;

        const entropy = pwd.length > 0 ? pwd.length * Math.log2(pool) : 0;
        
        let label = 'Very Weak';
        let color = 'bg-red-500';
        let textColor = 'text-red-500';

        if (score >= 90 && entropy > 80) { label = 'Very Strong'; color = 'bg-emerald-500'; textColor='text-emerald-500'}
        else if (score >= 70 && entropy > 60) { label = 'Strong'; color = 'bg-green-400'; textColor='text-green-500'}
        else if (score >= 40 && entropy > 40) { label = 'Fair'; color = 'bg-yellow-400'; textColor='text-yellow-500'}
        else if (score >= 20) { label = 'Weak'; color = 'bg-orange-500'; textColor='text-orange-500'}

        let timeToCrack = "Instant";
        if(entropy > 120) timeToCrack = "Trillions of years";
        else if(entropy > 100) timeToCrack = "Centuries";
        else if(entropy > 80) timeToCrack = "Decades";
        else if(entropy > 60) timeToCrack = "Months";
        else if(entropy > 40) timeToCrack = "Hours";

        return { score, label, color, textColor, checks, entropy, timeToCrack };
    };

    const strength = useMemo(() => checkStrength(password), [password]);

    // Add to history if good password
    useEffect(() => {
        if(password.length >= 8 && strength.score > 50) {
           const timer = setTimeout(() => {
               addCalculation({
                   title: 'Password Check',
                   details: `Length: ${password.length} chars`,
                   result: strength.label,
                   category: 'Lock'
               });
           }, 2000);
           return () => clearTimeout(timer);
        }
    }, [password, strength.score, strength.label, addCalculation]);

    return (
        <CalculatorLayout
            title="Password Checker"
            description="Test your password strength and entropy in real-time."
            icon={Lock}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="card p-6 space-y-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 mt-2">
                            Enter Password to Test
                        </label>
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Type a password..."
                                className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 font-mono text-lg"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                         <div className="flex justify-between items-center mb-1">
                             <span className={`font-black text-xl uppercase tracking-wider ${strength.textColor}`}>{strength.label}</span>
                             <span className="text-gray-500 text-sm font-bold">{Math.min(strength.score, 100)} / 100</span>
                         </div>
                         <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                             <div 
                                className={`${strength.color} h-3 rounded-full transition-all duration-500 ease-out`}
                                style={{ width: `${Math.min(strength.score, 100)}%` }}
                             ></div>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <CheckItem label="12+ Characters" active={strength.checks.length} />
                        <CheckItem label="Lowercase" active={strength.checks.lower} />
                        <CheckItem label="Uppercase" active={strength.checks.upper} />
                        <CheckItem label="Numbers" active={strength.checks.number} />
                        <CheckItem label="Symbols" active={strength.checks.symbol} />
                    </div>
                </div>

                {/* Secure Tips Card */}
                <div className="card p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-surface-dark border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-center space-y-6">
                    
                    <div className="p-6 bg-white dark:bg-surface-light rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800/50 flex flex-col items-center text-center">
                         <ShieldCheck className="text-indigo-500 mb-4" size={48} />
                         <p className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">Estimated Time to Crack</p>
                         <h2 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                             {strength.timeToCrack}
                         </h2>
                    </div>

                    <div className="bg-white dark:bg-surface-light p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                        <ShieldAlert className="text-yellow-500 shrink-0 mt-1" size={24} />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Security Concept: Entropy.</strong> 
                            <br></br>
                            Your password has an estimated entropy of <span className="font-mono font-bold">{strength.entropy.toFixed(1)} bits</span>. 
                            Aim for at least 60 bits for decent security, and 80+ for high security.
                        </p>
                    </div>

                </div>
            </div>
        </CalculatorLayout>
    );
}

function CheckItem({ label, active }) {
    return (
        <div className={`p-3 rounded-lg flex items-center gap-2 border transition-colors ${active ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <span className="font-medium text-xs">{label}</span>
        </div>
    );
}
