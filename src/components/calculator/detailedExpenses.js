// DetailedExpenses.js
import React, { useState, useEffect } from 'react';

const DetailedExpenses = ({ formData }) => {
    const {
        rent,
        rentersInsurance,
        downPaymentSavingsInterestRate,
        savingsInterestPostTaxRate,
        homeValue,
        maintenanceExpense,
        sellingCosts,
        loanAmount,
        interestRate,
        loanTerm
    } = formData;

    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const calculateExpenses = () => {
            const months = loanTerm * 12;
            const interestRateMonthly = interestRate / 100 / 12;
            const monthlyPayment = (
                loanAmount * interestRateMonthly * Math.pow(1 + interestRateMonthly, months)
            ) / (Math.pow(1 + interestRateMonthly, months) - 1);
            
            let beginningPrincipal = loanAmount;
            let totalRentExpense = 0;
            let totalHousingExpense = 0;
            const newExpenses = [];
            
            for (let month = 1; month <= months; month++) {
                const interestPayment = beginningPrincipal * interestRateMonthly;
                const principalPayment = monthlyPayment - interestPayment;
                const endingPrincipal = beginningPrincipal - principalPayment;
                const impounds = parseFloat(rentersInsurance) + maintenanceExpense;
                
                // Savings calculations
                const interestOnDownPaymentSavings = beginningPrincipal * (downPaymentSavingsInterestRate / 100 / 12);
                const interestOnSavingsPostTax = interestOnDownPaymentSavings * (savingsInterestPostTaxRate / 100);

                // Home value and equity calculations
                const homeValueCurrent = homeValue + (month * 5000); // Example increase per month
                const homeEquity = homeValueCurrent - endingPrincipal;

                // Net gain calculations
                const netGainBeforeTaxes = homeEquity - sellingCosts;
                const netGainAfterTaxes = netGainBeforeTaxes * 0.8; // Example tax deduction

                // Total expenses
                totalRentExpense = parseFloat(rent) + parseFloat(rentersInsurance) - interestOnSavingsPostTax;
                totalHousingExpense = totalRentExpense + monthlyPayment + impounds;

                newExpenses.push({
                    month,
                    rent: parseFloat(rent).toFixed(2),
                    rentersInsurance: parseFloat(rentersInsurance).toFixed(2),
                    interestOnDownPaymentSavings: interestOnDownPaymentSavings.toFixed(2),
                    interestOnSavingsPostTax: interestOnSavingsPostTax.toFixed(2),
                    totalRentExpense: totalRentExpense.toFixed(2),
                    beginningPrincipal: beginningPrincipal.toFixed(2),
                    interestPayment: interestPayment.toFixed(2),
                    principalPayment: principalPayment.toFixed(2),
                    principalInterestPayment: (interestPayment + principalPayment).toFixed(2),
                    impounds: impounds.toFixed(2),
                    totalPayment: (monthlyPayment + impounds).toFixed(2),
                    endingPrincipal: endingPrincipal.toFixed(2),
                    maintenanceExpense: maintenanceExpense.toFixed(2),
                    homeValue: homeValueCurrent.toFixed(2),
                    homeEquity: homeEquity.toFixed(2),
                    sellingCosts: sellingCosts.toFixed(2),
                    netGainBeforeTaxes: netGainBeforeTaxes.toFixed(2),
                    netGainAfterTaxes: netGainAfterTaxes.toFixed(2),
                    totalHousingExpense: totalHousingExpense.toFixed(2)
                });

                beginningPrincipal = endingPrincipal;

                if (endingPrincipal <= 0) break; // Exit loop if loan is fully paid off
            }

            setExpenses(newExpenses);
        };

        calculateExpenses();
    }, [formData]);

    return (
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
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
                {expenses.map((expense, index) => (
                    <tr key={index} className="bg-white border-b border-gray-200 hover:bg-blue-50">
                        <td className="p-4 text-gray-800">{expense.month}</td>
                        <td className="p-4 text-gray-800">{expense.rent}</td>
                        <td className="p-4 text-gray-800">{expense.rentersInsurance}</td>
                        <td className="p-4 text-gray-800">{expense.interestOnDownPaymentSavings}</td>
                        <td className="p-4 text-gray-800">{expense.interestOnSavingsPostTax}</td>
                        <td className="p-4 text-gray-800">{expense.totalRentExpense}</td>
                        <td className="p-4 text-gray-800">{expense.beginningPrincipal}</td>
                        <td className="p-4 text-gray-800">{expense.interestPayment}</td>
                        <td className="p-4 text-gray-800">{expense.principalPayment}</td>
                        <td className="p-4 text-gray-800">{expense.principalInterestPayment}</td>
                        <td className="p-4 text-gray-800">{expense.impounds}</td>
                        <td className="p-4 text-gray-800">{expense.totalPayment}</td>
                        <td className="p-4 text-gray-800">{expense.endingPrincipal}</td>
                        <td className="p-4 text-gray-800">{expense.maintenanceExpense}</td>
                        <td className="p-4 text-gray-800">{expense.homeValue}</td>
                        <td className="p-4 text-gray-800">{expense.homeEquity}</td>
                        <td className="p-4 text-gray-800">{expense.sellingCosts}</td>
                        <td className="p-4 text-gray-800">{expense.netGainBeforeTaxes}</td>
                        <td className="p-4 text-gray-800">{expense.netGainAfterTaxes}</td>
                        <td className="p-4 text-gray-800">{expense.totalHousingExpense}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DetailedExpenses;