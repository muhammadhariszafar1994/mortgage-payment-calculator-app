import React, { useState, useCallback } from 'react';
import Calculate from "./calculate.js";
import LoanPayment from "./loanPayment.js";
import PaymentBreakdown from './paymentBreakdown.js';
import MonthlyAmortizationDetail from './monthlyAmortizationDetail.js';
import DetailedExpenses from './detailedExpenses.js';

function Calculator() {
    const formData = {
        rent: 700,
        rentersInsurance: 15,
        downPaymentSavingsInterestRate: 1.5,
        savingsInterestPostTaxRate: 1.0,
        homeValue: 250000,
        maintenanceExpense: 58,
        sellingCosts: 10000,
        loanAmount: 200000,
        interestRate: 3.5,
        loanTerm: 7
    };

    const [results, setResults] = useState(null);
    
    const handleCalculation = useCallback((value) => {
        setResults(value);
    }, [results]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-1">
                    <Calculate onCalculate={handleCalculation} />
                </div>
                <div className="col-span-2">
                    <div className="my-9 flex justify-center" style={{ height: '500px' }}>
                        <PaymentBreakdown results={results} />
                    </div>
                    <LoanPayment results={results} />
                </div>
            </div>

            <div className="mt-10">
                <div className="border-b border-gray-200">
                    <MonthlyAmortizationDetail results={results}/>
                </div>
            </div>

            
        </div>
    );
}

export default Calculator;
