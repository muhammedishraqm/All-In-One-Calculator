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
    // We can add more here in the future to reach 50+
]
