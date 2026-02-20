import React, { useState } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Calculator } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function BasicCalculator() {
    const { addCalculation } = useHistoryContext();
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');
    const [newNumberLoading, setNewNumberLoading] = useState(false);

    const handleDigit = (digit) => {
        if (display === '0' || newNumberLoading) {
            setDisplay(digit);
            setNewNumberLoading(false);
        } else {
            setDisplay(display + digit);
        }
    };

    const handleOperator = (op) => {
        if (op === 'C') {
            setDisplay('0');
            setEquation('');
            return;
        }

        if (op === 'DEL') {
            if (display.length === 1 || (display.length === 2 && display[0] === '-')) {
                setDisplay('0');
            } else {
                setDisplay(display.slice(0, -1));
            }
            return;
        }

        if (op === '+/-') {
            setDisplay((parseFloat(display) * -1).toString());
            return;
        }

        if (op === '%') {
            setDisplay((parseFloat(display) / 100).toString());
            return;
        }

        if (op === '.') {
            if (!display.includes('.')) {
                setDisplay(display + '.');
                setNewNumberLoading(false);
            }
            return;
        }

        // Processing + - * /
        if (['+', '-', '×', '÷'].includes(op)) {
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
                default: return;
            }

            const formatRes = result.toString().length > 12 ? result.toPrecision(10) : result.toString();
            setDisplay(formatRes);
            setEquation('');
            setNewNumberLoading(true);

            addCalculation({
                title: 'Basic Math',
                details: `${prev} ${operator} ${current}`,
                result: formatRes,
                category: 'Calculator'
            });
        }
    };

    return (
        <CalculatorLayout
            title="Basic Calculator"
            description="Simple arithmetic operations."
            icon={Calculator}
        >
            <div className="max-w-md mx-auto card p-6 bg-gray-50 dark:bg-surface-dark border-gray-200 dark:border-gray-800 shadow-xl shadow-primary-500/5">
                
                {/* Display */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-end overflow-hidden group">
                    <div className="h-6 text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                        {equation}
                    </div>
                    <div className="text-5xl font-light text-gray-900 dark:text-white mt-2 tracking-tighter truncate w-full text-right transition-all">
                        {display}
                    </div>
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-4 gap-3">
                    <Btn op="C" onClick={handleOperator} color="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 font-bold hover:bg-red-200 dark:hover:bg-red-900/60" />
                    <Btn op="+/-" onClick={handleOperator} color="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold" />
                    <Btn op="%" onClick={handleOperator} color="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold" />
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

                    <Btn op="0" onClick={handleDigit} className="col-span-2 text-left pl-8" />
                    <Btn op="." onClick={handleOperator} />
                    <Btn op="=" onClick={handleOperator} color="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-black text-2xl hover:bg-black dark:hover:bg-white shadow-xl" />
                </div>
            </div>
        </CalculatorLayout>
    );
}

function Btn({ op, onClick, color = "bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm", className="" }) {
    return (
        <button
            onClick={() => onClick(op)}
            className={`h-16 rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center text-2xl ${color} ${className}`}
        >
            {op}
        </button>
    );
}
