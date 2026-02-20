import { useState, useCallback } from 'react';

const HISTORY_KEY = 'calculator_history';
const MAX_HISTORY = 10;

export function useCalculationHistory() {
    const [history, setHistory] = useState(() => {
        try {
            const stored = localStorage.getItem(HISTORY_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const addCalculation = useCallback((calc) => {
        setHistory(prev => {
            const newEntry = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                ...calc
            };

            const newHistory = [newEntry, ...prev].slice(0, MAX_HISTORY);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
            return newHistory;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem(HISTORY_KEY);
    }, []);

    return { history, addCalculation, clearHistory };
}
