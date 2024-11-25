import React, { useState, useCallback } from 'react';
import Calculate from "./calculate.js";
import SummaryResults from './summaryResults.js';


function HomeAffordabilityModel() {
    const [results, setResults] = useState(null);
    const [summaryResults, setSummaryResults] = useState(null);

    const handleCalculation = useCallback((value) => {
        setResults(value?.calculateMonthlyValues);
        setSummaryResults(value?.summaryResultsValues);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="col-span-1">
                    <Calculate onCalculate={handleCalculation} />
                </div>
                <div className="col-span-2">
                    <div className="mb-4">
                        <SummaryResults summaryResults={summaryResults}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeAffordabilityModel;
