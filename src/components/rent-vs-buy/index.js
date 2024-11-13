import React, { useState, useCallback } from 'react';
import Calculate from "./calculate.js";
import FinancialInformationDetail from './financialInformationDetail.js';
import SummaryResults from './summaryResults.js';

function RentVsBuy() {
    const [results, setResults] = useState(null);
    const [summaryResults, setSummaryResults] = useState(null);

    const handleCalculation = useCallback((value) => {
        console.log('value', value);

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
                    {/* <FinancialInformationDetail results={results} /> */}

                    {/* <div className="mb-4">
                        <SummaryResults results={results}/>
                    </div> */}
                    <div className="container mx-auto">
                        {
                            results?.length > 0 ? (
                                <>
                                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-auto" style={{height: '800px'}}>
                                        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center my-4">Financial Information Detail</h1>
                                        <table className="min-w-full border border-gray-300 rounded-lg ">
                                            <thead className="bg-gray-50">
                                                <tr className="bgSecondary text-white">
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Month</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rent</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Renter's Insurance</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Interest on Down Payment Savings</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Interest on Savings (post tax)</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Rent Expense</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Beginning Principal</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Interest Payment</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Principal Payment</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Principal & Interest Payment</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Impounds</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Payment</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ending Principal</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Maintenance Expense</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Home Value</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Home Equity</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Selling Costs</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Net Gain (Before Taxes)</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Net Gain (After Taxes)</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Housing Expense</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white border-b border-gray-200 hover:bg-blue-50">
                                                {results.map((row) => (
                                                    <tr key={row.month} className="bg-white border-b border-gray-200 hover:bg-blue-50">
                                                        <td className="p-4 text-gray-800">{row.month}</td>
                                                        <td className="p-4 text-gray-800">{row.rent}</td>
                                                        <td className="p-4 text-gray-800">{row.insurance}</td>
                                                        <td className="p-4 text-gray-800">{row.interestOnDownPaymentSavings}</td>
                                                        <td className="p-4 text-gray-800">{row.interestOnSavingsPostTax}</td>
                                                        <td className="p-4 text-gray-800">{row.totalRentExpense}</td>
                                                        <td className="p-4 text-gray-800">{row.beginningPrincipal}</td>
                                                        <td className="p-4 text-gray-800">{row.interestPayment}</td>
                                                        <td className="p-4 text-gray-800">{row.principalPayment}</td>
                                                        <td className="p-4 text-gray-800">{row.principalAndInterestPayment}</td>
                                                        <td className="p-4 text-gray-800">{row.impounds}</td>
                                                        <td className="p-4 text-gray-800">{row.totalPayment}</td>
                                                        <td className="p-4 text-gray-800">{row.endingPrincipal}</td>
                                                        <td className="p-4 text-gray-800">{row.maintenanceExpense}</td>
                                                        <td className="p-4 text-gray-800">{row.homeValue}</td>
                                                        <td className="p-4 text-gray-800">{row.homeEquity}</td>
                                                        <td className="p-4 text-gray-800">{row.sellingCosts}</td>
                                                        <td className="p-4 text-gray-800">{row.netGainBeforeTaxes}</td>
                                                        <td className="p-4 text-gray-800">{row.netGainAfterTaxes}</td>
                                                        <td className="p-4 text-gray-800">{row.totalHousingExpense}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) 
                            : 
                            <><h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">No Detail Found!</h1></>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RentVsBuy;
