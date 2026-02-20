import React, { createContext, useContext } from 'react';
import { useCalculationHistory as useCalcHistory } from '../hooks/useCalculationHistory';

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
    const history = useCalcHistory();
    return (
        <HistoryContext.Provider value={history}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistoryContext() {
    return useContext(HistoryContext);
}
