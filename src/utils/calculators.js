// Standard data for all calculators in the app

export const CATEGORIES = {
  CORE: 'Core Calculators',
  FINANCE: 'Finance & Investment',
  HEALTH: 'Health & Fitness',
  CONVERTERS: 'Unit Converters',
  MATH: 'Math & Statistics',
  UTILITIES: 'Everyday Utilities',
}

export const CALCULATORS = [
  /* --- CORE --- */
  { id: 'basic-math',
    name: 'Basic Calculator', 
    path: '/core/basic',
    category: CATEGORIES.CORE,
    description: 'Simple arithmetic (add, subtract, multiply, divide).',
    keywords: ['math', 'basic', 'arithmetic', 'simple', '+'] },
  { id: 'scientific', name: 'Scientific Calculator', path: '/core/scientific', category: CATEGORIES.CORE, description: 'Advanced trig, logs, exponents, and roots.', keywords: ['math', 'science', 'trig', 'log', 'sin', 'cos', 'tan'] },
  { id: 'fuel-expenses', name: 'Fuel Expenses', path: '/core/fuel', category: CATEGORIES.CORE, description: 'Calculate trip fuel costs and efficiency.', keywords: ['car', 'driving', 'gas', 'fuel', 'trip', 'cost'] },
  
  /* --- UTILITIES --- */
  { id: 'age-calculator', name: 'Age Calculator', path: '/utilities/age', category: CATEGORIES.UTILITIES, description: 'Calculate exact age in years, months, and days.', keywords: ['age', 'birthday', 'date', 'old', 'years', 'months'] },
  { id: 'gst-calculator', name: 'GST / Tax Calculator', path: '/utilities/gst', category: CATEGORIES.UTILITIES, description: 'Quickly add or remove Indian GST from amounts.', keywords: ['tax', 'gst', 'money', 'india', 'cgst', 'sgst', 'net'] },
  { id: 'tip-splitter', name: 'Tip & Bill Splitter', path: '/utilities/tip', category: CATEGORIES.UTILITIES, description: 'Calculate tips and split bills among friends.', keywords: ['restaurant', 'tip', 'split', 'bill', 'dinner', 'gratuity'] },
  { id: 'paycheck', name: 'Paycheck Estimator', path: '/utilities/paycheck', category: CATEGORIES.UTILITIES, description: 'Estimate net salary after standard deductions.', keywords: ['salary', 'income', 'pay', 'check', 'wage'] },
  { id: 'date-diff', name: 'Date Difference', path: '/utilities/date-diff', category: CATEGORIES.UTILITIES, description: 'Find days/months between two dates.', keywords: ['time', 'date', 'difference', 'days between'] },
  { id: 'time-calc', name: 'Time Calculator', path: '/utilities/time', category: CATEGORIES.UTILITIES, description: 'Add or subtract hours/minutes.', keywords: ['time', 'hours', 'minutes', 'add time'] },
  { id: 'word-counter', name: 'Word & Character Counter', path: '/utilities/words', category: CATEGORIES.UTILITIES, description: 'Count words, characters, and spaces in text.', keywords: ['text', 'words', 'count', 'characters', 'length'] },
  { id: 'password-strength', name: 'Password Checker', path: '/utilities/password', category: CATEGORIES.UTILITIES, description: 'Check password strength and entropy.', keywords: ['security', 'password', 'strength', 'secure', 'hash'] },

  /* --- FINANCE --- */
  { id: 'compound-interest', name: 'Compound Interest', path: '/finance/compound-interest', category: CATEGORIES.FINANCE, description: 'Calculate compound interest and future value.', keywords: ['finance', 'investment', 'money', 'interest', 'compound', 'future'] },
  { id: 'house-loan-emi', name: 'House Loan EMI', path: '/finance/emi', category: CATEGORIES.FINANCE, description: 'Calculate Equated Monthly Installment for house loans.', keywords: ['finance', 'loan', 'mortgage', 'emi', 'house', 'interest'] },
  { id: 'sip-returns', name: 'SIP Returns', path: '/finance/sip', category: CATEGORIES.FINANCE, description: 'Estimate future value of SIP mutual fund investments.', keywords: ['finance', 'investment', 'sip', 'mutual fund', 'returns', 'wealth'] },
  { id: 'loan-amortization', name: 'Loan Amortization', path: '/finance/amortization', category: CATEGORIES.FINANCE, description: 'View month-by-month breakdown of your loan payment schedule.', keywords: ['finance', 'loan', 'amortization', 'schedule', 'table', 'emi', 'interest'] },
  { id: 'retirement', name: 'Retirement Savings', path: '/finance/retirement', category: CATEGORIES.FINANCE, description: 'Plan your long-term retirement corpus.', keywords: ['retire', 'savings', 'pension', 'old age', 'corpus'] },
  { id: 'income-tax', name: 'Income Tax Estimator', path: '/finance/tax', category: CATEGORIES.FINANCE, description: 'Estimate Indian Income Tax (New Regime).', keywords: ['tax', 'india', 'income', 'itr', 'slab'] },
  { id: 'fd-maturity', name: 'FD Maturity', path: '/finance/fd', category: CATEGORIES.FINANCE, description: 'Calculate Fixed Deposit returns.', keywords: ['bank', 'deposit', 'fd', 'fixed', 'interest', 'maturity'] },
  { id: 'inflation-adj', name: 'Inflation-Adjusted Returns', path: '/finance/inflation', category: CATEGORIES.FINANCE, description: 'Calculate real rate of return passing inflation.', keywords: ['inflation', 'real return', 'purchasing power', 'money'] },
  { id: 'xirr', name: 'XIRR Calculator', path: '/finance/xirr', category: CATEGORIES.FINANCE, description: 'Calculate extended internal rate of return.', pos: 0, keywords: ['xirr', 'irregular flows', 'returns', 'cash flow', 'finance'] },
  { id: 'roi', name: 'ROI Calculator', path: '/finance/roi', category: CATEGORIES.FINANCE, description: 'Calculate Return on Investment percentage.', keywords: ['business', 'roi', 'return', 'profit', 'margin'] },
  { id: 'currency', name: 'Currency Converter', path: '/finance/currency', category: CATEGORIES.FINANCE, description: 'Convert common world currencies offline/online.', keywords: ['money', 'forex', 'currency', 'exchange', 'usd', 'inr', 'eur'] },

  /* --- HEALTH --- */
  { id: 'bmi', name: 'BMI Calculator', path: '/health/bmi', category: CATEGORIES.HEALTH, description: 'Calculate your Body Mass Index (BMI).', keywords: ['body', 'mass', 'index', 'weight', 'health', 'fitness'] },
  { id: 'bmr', name: 'BMR Calculator', path: '/health/bmr', category: CATEGORIES.HEALTH, description: 'Calculate Basal Metabolic Rate (Mifflin-St Jeor).', keywords: ['metabolism', 'calories', 'burn', 'resting', 'health', 'bmr'] },
  { id: 'calorie-intake', name: 'Calorie Needs', path: '/health/calories', category: CATEGORIES.HEALTH, description: 'Estimate daily calorie intake for goals.', keywords: ['diet', 'food', 'intake', 'deficit', 'surplus', 'calories'] },
  { id: 'body-fat', name: 'Body Fat %', path: '/health/bodyfat', category: CATEGORIES.HEALTH, description: 'Estimate body fat using the US Navy method.', keywords: ['fat', 'lean', 'mass', 'navy', 'health'] },
  { id: 'ideal-weight', name: 'Ideal Weight', path: '/health/ideal-weight', category: CATEGORIES.HEALTH, description: 'Find your target weight using Devine formulas.', keywords: ['weight', 'goal', 'devine', 'health'] },
  { id: 'water-intake', name: 'Water Target', path: '/health/water', category: CATEGORIES.HEALTH, description: 'Calculate daily hydration requirements.', keywords: ['hydrate', 'water', 'drink', 'fluid'] },
  { id: 'pregnancy', name: 'Due Date Calculator', path: '/health/pregnancy', category: CATEGORIES.HEALTH, description: 'Estimate pregnancy due dates (LMP + 280).', keywords: ['baby', 'pregnant', 'due date', 'lmp'] },
  { id: 'pace', name: 'Running Pace', path: '/health/pace', category: CATEGORIES.HEALTH, description: 'Calculate running pace min/km.', keywords: ['run', 'marathon', 'speed', 'min/km', 'jog'] },
  { id: 'vo2max', name: 'VO2 Max Estimator', path: '/health/vo2max', category: CATEGORIES.HEALTH, description: 'Estimate cardiovascular fitness via walk tests.', keywords: ['cardio', 'heart', 'vo2', 'fitness', 'endurance'] },

  /* --- MATH --- */
  { id: 'binomial-probability', name: 'Probability', path: '/math/probability', category: CATEGORIES.MATH, description: 'Calculate chances of k successes in n trials.', keywords: ['math', 'probability', 'statistics', 'binomial', 'chance', 'success'] },
  { id: 'statistics', name: 'Statistics', path: '/math/statistics', category: CATEGORIES.MATH, description: 'Find mean, median, mode, variance, and standard deviation.', keywords: ['math', 'statistics', 'mean', 'median', 'mode', 'standard deviation', 'variance'] },
  { id: 'equation-solver', name: 'Equation Solver', path: '/math/equation', category: CATEGORIES.MATH, description: 'Find real or complex roots for quadratic equations.', keywords: ['math', 'algebra', 'equation', 'quadratic', 'roots', 'solve'] },
  { id: 'percentage', name: 'Percentage Change', path: '/math/percentage', category: CATEGORIES.MATH, description: 'Calculate % increase or decrease quickly.', keywords: ['percent', 'math', 'increase', 'decrease'] },
  { id: 'gcd-lcm', name: 'GCD / LCM', path: '/math/gcd', category: CATEGORIES.MATH, description: 'Find Greatest Common Divisor and Least Common Multiple.', keywords: ['math', 'factor', 'divide', 'multiple'] },
  { id: 'combinations', name: 'Combinations (nCr)', path: '/math/combinations', category: CATEGORIES.MATH, description: 'Calculate combinations and permutations.', keywords: ['math', 'permute', 'select', 'ncr', 'npr'] },
  { id: 'fractions', name: 'Fraction Simplifier', path: '/math/fractions', category: CATEGORIES.MATH, description: 'Simplify fractions quickly using GCD.', keywords: ['math', 'fraction', 'simplify', 'numerator'] },

  /* --- CONVERTERS --- */
  { id: 'length-converter', name: 'Length', path: '/converters/length', category: CATEGORIES.CONVERTERS, description: 'Convert between different units of length.', keywords: ['convert', 'length', 'distance', 'meters', 'feet', 'inches', 'cm'] },
  { id: 'weight-converter', name: 'Weight', path: '/converters/weight', category: CATEGORIES.CONVERTERS, description: 'Convert between kg, lbs, grams, etc.', keywords: ['convert', 'mass', 'weight', 'kg', 'lb', 'pound'] },
  { id: 'temp-converter', name: 'Temperature', path: '/converters/temperature', category: CATEGORIES.CONVERTERS, description: 'Convert Celsius to Fahrenheit.', keywords: ['convert', 'hot', 'cold', 'celsius', 'fahrenheit', 'kelvin'] },
  { id: 'volume-converter', name: 'Volume', path: '/converters/volume', category: CATEGORIES.CONVERTERS, description: 'Liters, gallons, fluid ounces conversion.', keywords: ['convert', 'liquid', 'gallon', 'liter', 'oz'] },
  { id: 'speed-converter', name: 'Speed', path: '/converters/speed', category: CATEGORIES.CONVERTERS, description: 'km/h to mph conversions.', keywords: ['convert', 'fast', 'mph', 'kmh', 'speed'] },
  { id: 'fueleff-converter', name: 'Fuel Efficiency', path: '/converters/fueleff', category: CATEGORIES.CONVERTERS, description: 'kmpl to mpg conversions.', keywords: ['convert', 'car', 'gas', 'mpg', 'kmpl'] },
  { id: 'area-converter', name: 'Area', path: '/converters/area', category: CATEGORIES.CONVERTERS, description: 'Convert between sq meters, sq ft, acres.', keywords: ['convert', 'size', 'acre', 'sqft', 'sqm', 'area'] },
  { id: 'timezone', name: 'Time Zones', path: '/converters/timezone', category: CATEGORIES.CONVERTERS, description: 'Convert times across different global zones.', keywords: ['convert', 'time', 'world', 'clock', 'gmt', 'est'] }
]
