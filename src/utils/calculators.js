// Standard data for all calculators in the app

export const CATEGORIES = {
  HEALTH: 'Health & Fitness',
  FINANCE: 'Finance & Investment',
  MATH: 'Mathematics',
  CONVERTERS: 'Converters',
}

export const CALCULATORS = [
  {
    id: 'bmi',
    name: 'BMI Calculator',
    path: '/health/bmi',
    category: CATEGORIES.HEALTH,
    description: 'Calculate your Body Mass Index (BMI).',
    keywords: ['body', 'mass', 'index', 'weight', 'health', 'fitness']
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    path: '/finance/compound-interest',
    category: CATEGORIES.FINANCE,
    description: 'Calculate compound interest and future value.',
    keywords: ['finance', 'investment', 'money', 'interest', 'compound', 'future']
  },
  {
    id: 'length-converter',
    name: 'Length Converter',
    path: '/converters/length',
    category: CATEGORIES.CONVERTERS,
    description: 'Convert between different units of length.',
    keywords: ['convert', 'length', 'distance', 'meters', 'feet', 'inches', 'cm']
  },
  {
    id: 'house-loan-emi',
    name: 'House Loan EMI',
    path: '/finance/emi',
    category: CATEGORIES.FINANCE,
    description: 'Calculate Equated Monthly Installment for house loans.',
    keywords: ['finance', 'loan', 'mortgage', 'emi', 'house', 'interest']
  },
  {
    id: 'sip-returns',
    name: 'SIP Returns',
    path: '/finance/sip',
    category: CATEGORIES.FINANCE,
    description: 'Estimate future value of SIP mutual fund investments.',
    keywords: ['finance', 'investment', 'sip', 'mutual fund', 'returns', 'wealth']
  },
  {
    id: 'loan-amortization',
    name: 'Loan Amortization',
    path: '/finance/amortization',
    category: CATEGORIES.FINANCE,
    description: 'View month-by-month breakdown of your loan payment schedule.',
    keywords: ['finance', 'loan', 'amortization', 'schedule', 'table', 'emi', 'interest']
  }
]
