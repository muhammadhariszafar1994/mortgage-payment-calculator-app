import React, { useState, useCallback } from 'react';
import Calculate from "./calculate.js";
import List from './list.js';


function LoanScenarioComparison() {
    const [results, setResults] = useState(null);

    const handleCalculation = useCallback((value) => {
        setResults(value);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="col-span-1">
                    <Calculate onCalculate={handleCalculation} />
                </div>
                <div className="col-span-2">
                    <div className="mb-4">
                        <List results={results}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoanScenarioComparison;