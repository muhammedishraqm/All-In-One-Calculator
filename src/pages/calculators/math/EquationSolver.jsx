import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Calculator } from 'lucide-react';
import { useHistoryContext } from '../../../context/HistoryContext';

export default function EquationSolver() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-3');
  const [c, setC] = useState('2');
  
  const [result, setResult] = useState(null);
  const { addCalculation } = useHistoryContext();

  useEffect(() => {
    solveQuadratic();
  }, [a, b, c]);

  const solveQuadratic = () => {
    const valA = parseFloat(a);
    const valB = parseFloat(b);
    const valC = parseFloat(c);

    if (isNaN(valA) || isNaN(valB) || isNaN(valC)) {
      setResult(null);
      return;
    }

    if (valA === 0) {
      if (valB === 0) {
        setResult({ type: 'none', message: 'Not an equation (a=0, b=0).' });
      } else {
        const x = -valC / valB;
        setResult({ type: 'linear', x: x.toFixed(4) });
         addCalculation({
             type: 'Linear Equation',
             summary: `x = <b>${x.toFixed(4)}</b> <br/> <span class="text-xs text-gray-500">${valB}x + ${valC} = 0</span>`
         });
      }
      return;
    }

    const discriminant = Math.pow(valB, 2) - 4 * valA * valC;

    if (discriminant > 0) {
      const root1 = (-valB + Math.sqrt(discriminant)) / (2 * valA);
      const root2 = (-valB - Math.sqrt(discriminant)) / (2 * valA);
      setResult({ 
          type: 'real_distinct', 
          root1: root1.toFixed(4), 
          root2: root2.toFixed(4) 
      });
      addCalculation({
        type: 'Quadratic Solver',
        summary: `x₁=<b>${root1.toFixed(4)}</b>, x₂=<b>${root2.toFixed(4)}</b> <br/> <span class="text-xs text-gray-500">${valA}x² + ${valB}x + ${valC} = 0</span>`
      });
    } else if (discriminant === 0) {
      const root1 = -valB / (2 * valA);
      setResult({ 
          type: 'real_equal', 
          root1: root1.toFixed(4) 
      });
       addCalculation({
        type: 'Quadratic Solver',
        summary: `x=<b>${root1.toFixed(4)}</b> (Repeated) <br/> <span class="text-xs text-gray-500">${valA}x² + ${valB}x + ${valC} = 0</span>`
      });
    } else {
      const realPart = (-valB / (2 * valA)).toFixed(4);
      const imaginaryPart = (Math.sqrt(-discriminant) / (2 * valA)).toFixed(4);
      setResult({ 
          type: 'complex', 
          realPart, 
          imaginaryPart 
      });
       addCalculation({
        type: 'Quadratic Solver',
        summary: `x₁=<b>${realPart}+${imaginaryPart}i</b> <br/> <span class="text-xs text-gray-500">Complex Roots</span>`
      });
    }
  };

  const currentEquationString = () => {
      let eqA = parseFloat(a) || 0;
      let eqB = parseFloat(b) || 0;
      let eqC = parseFloat(c) || 0;
      
      let termA = eqA !== 0 ? `${eqA}x² ` : '';
      let termB = eqB > 0 && eqA !== 0 ? `+ ${eqB}x ` : eqB !== 0 ? `${eqB}x ` : '';
      let termC = eqC > 0 && (eqA !== 0 || eqB !== 0) ? `+ ${eqC}` : eqC !== 0 ? `${eqC}` : '';
      
      let finalStr = `${termA}${termB}${termC} = 0`;
      return finalStr.trim() === '= 0' ? '0 = 0' : finalStr;
  }

  return (
    <CalculatorLayout 
      title="Quadratic Equation Solver" 
      description="Find the roots (real or complex) of any quadratic equation (ax² + bx + c = 0)."
      icon={Calculator}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        
        {/* Input Section */}
        <div className="card p-6 space-y-6">
          <div className="text-center font-bold text-2xl tracking-widest text-primary-600 dark:text-primary-400 py-6 bg-primary-50 dark:bg-primary-900/10 rounded-xl font-mono border-b border-primary-100 dark:border-primary-900/30">
              {currentEquationString()}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="label-text w-12 font-mono text-xl">a = </label>
              <input 
                type="number" 
                className="input-field flex-1" 
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="Coefficient a"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <label className="label-text w-12 font-mono text-xl">b = </label>
              <input 
                type="number" 
                className="input-field flex-1" 
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="Coefficient b"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="label-text w-12 font-mono text-xl">c = </label>
              <input 
                type="number" 
                className="input-field flex-1" 
                value={c}
                onChange={(e) => setC(e.target.value)}
                placeholder="Constant c"
              />
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
            {result ? (
                <div className="card p-8 h-full flex flex-col items-center justify-center animate-fade-in bg-gray-50/50 dark:bg-gray-800/20 text-center">
                    
                    {result.type === 'none' && (
                        <div className="text-gray-500">Not a valid equation parameters.</div>
                    )}
                    
                    {result.type === 'linear' && (
                        <div className="space-y-4">
                            <span className="text-sm font-bold uppercase tracking-widest text-primary-500">Linear Root</span>
                            <div className="text-5xl font-black text-gray-900 dark:text-white font-mono">
                                x = {result.x}
                            </div>
                        </div>
                    )}

                    {result.type === 'real_distinct' && (
                        <div className="space-y-8 w-full max-w-sm">
                            <span className="text-sm font-bold uppercase tracking-widest text-green-500 mb-4 block">Two Real Roots</span>
                            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                                <span className="text-2xl font-mono text-gray-500">x₁</span>
                                <span className="text-4xl font-black text-gray-900 dark:text-white font-mono">{result.root1}</span>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <span className="text-2xl font-mono text-gray-500">x₂</span>
                                <span className="text-4xl font-black text-gray-900 dark:text-white font-mono">{result.root2}</span>
                            </div>
                        </div>
                    )}

                    {result.type === 'real_equal' && (
                        <div className="space-y-4">
                            <span className="text-sm font-bold uppercase tracking-widest text-blue-500">Repeated Real Root</span>
                            <div className="text-5xl font-black text-gray-900 dark:text-white font-mono mt-4">
                                x = {result.root1}
                            </div>
                        </div>
                    )}

                    {result.type === 'complex' && (
                        <div className="space-y-8 w-full max-w-md">
                            <span className="text-sm font-bold uppercase tracking-widest text-purple-500 mb-4 block">Complex Roots</span>
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="text-3xl font-mono text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                                    x₁ = {result.realPart} + <span className="text-purple-500">{result.imaginaryPart}i</span>
                                </div>
                                <div className="text-3xl font-mono text-gray-900 dark:text-white">
                                    x₂ = {result.realPart} - <span className="text-purple-500">{result.imaginaryPart}i</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            ) : (
                <div className="card p-6 h-full flex items-center justify-center text-center text-gray-400">
                    <div>
                        <Calculator size={48} className="mx-auto opacity-20 mb-4" />
                        <p>Enter coefficients (a, b, c) to solve.</p>
                    </div>
                </div>
            )}
        </div>

      </div>
    </CalculatorLayout>
  );
}
