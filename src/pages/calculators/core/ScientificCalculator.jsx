import React, { useState } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { FlaskConical } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function ScientificCalculator() {
    const { addCalculation } = useHistoryContext();
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');
    const [newNumberLoading, setNewNumberLoading] = useState(false);
    const [isRadians, setIsRadians] = useState(false);

    const handleDigit = (digit) => {
        if (display === '0' || newNumberLoading) {
            if(digit === 'π') setDisplay(Math.PI.toString());
            else if (digit === 'e') setDisplay(Math.E.toString());
            else setDisplay(digit);
            setNewNumberLoading(false);
        } else {
            if(digit === 'π' || digit === 'e') return; // Cannot append const to number directly
            setDisplay(display + digit);
        }
    };

    const handleScientific = (func) => {
        const val = parseFloat(display);
        let res = val;
        let title = '';

        const convertAngle = (angle) => isRadians ? angle : angle * (Math.PI / 180);

        try {
            switch(func) {
                case 'sin': res = Math.sin(convertAngle(val)); title = `sin(${val})`; break;
                case 'cos': res = Math.cos(convertAngle(val)); title = `cos(${val})`; break;
                case 'tan': res = Math.tan(convertAngle(val)); title = `tan(${val})`; break;
                case 'ln': res = Math.log(val); title = `ln(${val})`; break;
                case 'log': res = Math.log10(val); title = `log(${val})`; break;
                case '√': res = Math.sqrt(val); title = `√${val}`; break;
                case 'x²': res = Math.pow(val, 2); title = `${val}²`; break;
                case '1/x': res = 1 / val; title = `1/${val}`; break;
                case 'x!': 
                    res = factorial(val); title = `${val}!`; 
                    break;
                default: return;
            }

            const formatRes = Number.isInteger(res) ? res.toString() : res.toPrecision(10).replace(/0+$/, '').replace(/\.$/, '');
            setDisplay(formatRes);
            setNewNumberLoading(true);

            addCalculation({
                title: 'Scientific Math',
                details: title,
                result: formatRes,
                category: 'FlaskConical'
            });

        } catch (e) {
            setDisplay('Error');
            setNewNumberLoading(true);
        }
    };

    const factorial = (n) => {
        if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid');
        if (n === 0 || n === 1) return 1;
        let p = 1;
        for (let i = 2; i <= n; i++) p *= i;
        return p;
    }

    const handleOperator = (op) => {
        if (op === 'C') {
            setDisplay('0');
            setEquation('');
            return;
        }

        if (op === 'DEL') {
            if (display.length === 1 || (display.length === 2 && display[0] === '-')) setDisplay('0');
            else setDisplay(display.slice(0, -1));
            return;
        }

        if (op === '+/-') {
            setDisplay((parseFloat(display) * -1).toString());
            return;
        }

        if (op === '.') {
            if (!display.includes('.')) {
                setDisplay(display + '.');
                setNewNumberLoading(false);
            }
            return;
        }

        if (['+', '-', '×', '÷', '^'].includes(op)) {
            setEquation(`${display} ${op}`);
            setNewNumberLoading(true);
            return;
        }

        if (op === '=') {
            if (!equation) return;
            
            const [prev, operator] = equation.split(' ');
            const current = parseFloat(display);
            const previous = parseFloat(prev);
            let result = 0;

            switch (operator) {
                case '+': result = previous + current; break;
                case '-': result = previous - current; break;
                case '×': result = previous * current; break;
                case '÷': result = current !== 0 ? previous / current : 'Error'; break;
                case '^': result = Math.pow(previous, current); break;
                default: return;
            }

            if(result === 'Error') {
                setDisplay('Error');
            } else {
                const formatRes = result.toString().length > 12 ? result.toPrecision(10).replace(/0+$/, '').replace(/\.$/, '') : result.toString();
                setDisplay(formatRes);
                addCalculation({
                    title: 'Math',
                    details: `${prev} ${operator} ${current}`,
                    result: formatRes,
                    category: 'FlaskConical'
                });
            }
            setEquation('');
            setNewNumberLoading(true);
        }
    };

    return (
        <CalculatorLayout
            title="Scientific Calculator"
            description="Advanced trigonometric and logarithmic engine."
            icon={FlaskConical}
        >
             <div className="max-w-2xl mx-auto card p-6 bg-gray-50 dark:bg-surface-dark border-gray-200 dark:border-gray-800 shadow-xl shadow-primary-500/5">
                
                {/* Display */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-end overflow-hidden group relative">
                    <button 
                         onClick={() => setIsRadians(!isRadians)}
                         className="absolute top-4 left-4 px-2 py-1 text-xs font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                         {isRadians ? 'RAD' : 'DEG'}
                    </button>
                    <div className="h-6 text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                        {equation}
                    </div>
                    <div className="text-5xl font-light text-gray-900 dark:text-white mt-2 tracking-tighter truncate w-full text-right transition-all">
                        {display}
                    </div>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                    {/* Scientific Grid (Hidden on Mobile) */}
                    <div className="col-span-4 md:col-span-1 grid grid-cols-4 md:grid-cols-1 gap-2 md:gap-3 mb-2 md:mb-0">
                        <Btn op="sin" onClick={() => handleScientific('sin')} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm" />
                        <Btn op="cos" onClick={() => handleScientific('cos')} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm" />
                        <Btn op="tan" onClick={() => handleScientific('tan')} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm" />
                        <Btn op="log" onClick={() => handleScientific('log')} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm" />
                        <Btn op="ln" onClick={() => handleScientific('ln')} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm md:flex hidden" />
                    </div>

                    <div className="col-span-4 grid grid-cols-4 gap-2 md:gap-3">
                         <Btn op="x²" onClick={() => handleScientific('x²')} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm" />
                         <Btn op="√" onClick={() => handleScientific('√')} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm" />
                         <Btn op="^" onClick={handleOperator} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm" />
                         <Btn op="x!" onClick={() => handleScientific('x!')} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm" />

                         <Btn op="C" onClick={handleOperator} color="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 font-bold hover:bg-red-200 shadow-none border-red-200" />
                         <Btn op="π" onClick={handleDigit} color="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-lg font-serif" />
                         <Btn op="e" onClick={handleDigit} color="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-lg font-serif" />
                         <Btn op="÷" onClick={handleOperator} color="bg-primary-500 text-white font-black text-xl hover:bg-primary-600 shadow-md shadow-primary-500/20" />

                         <Btn op="7" onClick={handleDigit} />
                         <Btn op="8" onClick={handleDigit} />
                         <Btn op="9" onClick={handleDigit} />
                         <Btn op="×" onClick={handleOperator} color="bg-primary-500 text-white font-black text-xl hover:bg-primary-600 shadow-md shadow-primary-500/20" />

                         <Btn op="4" onClick={handleDigit} />
                         <Btn op="5" onClick={handleDigit} />
                         <Btn op="6" onClick={handleDigit} />
                         <Btn op="-" onClick={handleOperator} color="bg-primary-500 text-white font-black text-xl hover:bg-primary-600 shadow-md shadow-primary-500/20" />

                         <Btn op="1" onClick={handleDigit} />
                         <Btn op="2" onClick={handleDigit} />
                         <Btn op="3" onClick={handleDigit} />
                         <Btn op="+" onClick={handleOperator} color="bg-primary-500 text-white font-black text-xl hover:bg-primary-600 shadow-md shadow-primary-500/20" />

                         <Btn op="+/-" onClick={handleOperator} />
                         <Btn op="0" onClick={handleDigit} />
                         <Btn op="." onClick={handleOperator} />
                         <Btn op="=" onClick={handleOperator} color="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-black text-2xl hover:bg-black dark:hover:bg-white shadow-xl" />
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
}

function Btn({ op, onClick, color = "bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm", className="" }) {
    return (
        <button
            onClick={() => onClick(op)}
            className={`h-14 md:h-16 rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center text-xl ${color} ${className}`}
        >
            {op}
        </button>
    );
}
