import React, { useState, useCallback } from 'react';
import Calculate from "./calculate.js";
import List from './list.js';
import CummulativeInterest from './cummulative-interest.js';


function LoanScenarioComparison() {
    const [results, setResults] = useState(null);
    const [cummulativeInterest, setCummulativeInterest] = useState(null);

    const handleCalculation = useCallback((value) => {
        setResults(value?.results);
        setCummulativeInterest(value?.cummulativeInterest);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="col-span-1">
                    <Calculate onCalculate={handleCalculation} />
                    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 mt-4 flex items-center">
                        <h3 className="text-lg font-semibold text-gray-600 me-auto">Cummulative interest: </h3>
                        <CummulativeInterest cummulativeInterest={cummulativeInterest} />
                    </div>
                    
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
