import { useState, useEffect } from "react";
import { loanPurpose, loanTermData, interestRateData } from "./variables/data";
import { numberWithCommas, removeCommas } from "../../helper";

const incrementedValue = 10000;

function Calculate({onCalculate}) {
    const [loanPurpose_, setLoanPurpose_] = useState(true);

    const [formData, setFormData] = useState({
        loanAmount: '',
        loanPurpose: loanPurpose()?.[0],
        purchasePrice: '',
        appraisedValue: '',
        loanTerm: loanTermData()?.[0],
        interestRate: interestRateData()?.[0],
        propertyTax: '',
        insurance: ''
    });

    const [results, setResults] = useState({
        principalInterest: null,
        taxesInsurance: null,
        totalPayment: null,
        principalInterestPercent: null,
        taxesInsurancePercent: null,
        paymentBreakdown: null,
        amortizationSchedule: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = numberWithCommas(value);
        setFormData({
            ...formData,
            // [name]: value
            [name]: formattedValue
        });
    };

    useEffect(() => {
        onCalculate(results);
    }, [handleChange]);

    useEffect(() => {
        const {
            loanAmount,
            loanTerm,
            interestRate,
            propertyTax,
            insurance
        } = formData;


        const loan = parseFloat(removeCommas(loanAmount));
        const term = parseFloat(removeCommas(loanTerm));
        const rate = parseFloat(removeCommas(interestRate)) / 100 / 12;
        const months = term * 12;
        const annualPropertyTax = parseFloat(removeCommas(propertyTax));
        const annualInsurance = parseFloat(removeCommas(insurance));

        if (loan && term && interestRate) {
            const monthlyPayment = (
                loan * rate * Math.pow(1 + rate, months)
            ) / (Math.pow(1 + rate, months) - 1);

            const monthlyPropertyTax = annualPropertyTax / 12;
            const monthlyInsurance = annualInsurance / 12;

            const principalInterest = !isNaN(monthlyPayment) && monthlyPayment.toFixed(2);
            const taxesInsurance = !isNaN(monthlyPropertyTax + monthlyInsurance) && (monthlyPropertyTax + monthlyInsurance).toFixed(2);
            const totalPayment = !isNaN((monthlyPayment + monthlyPropertyTax + monthlyInsurance)) && (monthlyPayment + monthlyPropertyTax + monthlyInsurance).toFixed(2);
            
            const principalInterestPercent = !isNaN(principalInterest/totalPayment) && Math.round(((principalInterest/totalPayment) * 100).toFixed(2));
            const taxesInsurancePercent = !isNaN(taxesInsurance/totalPayment) && Math.round(((taxesInsurance/totalPayment) * 100).toFixed(2));

            const monthlyAmortizationSchedule = [];
            let beginningBalance = loan;
            let cumulativeInterest = 0;
            let cumulativePrincipal = 0;

            for (let month = 1; month <= months; month++) {
                const interestPayment = beginningBalance * rate;
                const principalPayment = monthlyPayment - interestPayment;
                const endingBalance = beginningBalance - principalPayment;
                cumulativeInterest += interestPayment;
                cumulativePrincipal += principalPayment;

                monthlyAmortizationSchedule.push({
                    month: !isNaN(month) && month,
                    beginningBalance: !isNaN(beginningBalance) && numberWithCommas(beginningBalance.toFixed(2)),
                    interestPayment: !isNaN(interestPayment) && numberWithCommas(interestPayment.toFixed(2)),
                    principalPayment: !isNaN(principalPayment) && numberWithCommas(principalPayment.toFixed(2)),
                    pAndiPayment: (!isNaN(interestPayment) && !isNaN(principalPayment)) && numberWithCommas((parseFloat(interestPayment) + parseFloat(principalPayment)).toFixed(2)),
                    impounds: !isNaN(monthlyPropertyTax + monthlyInsurance) && numberWithCommas((monthlyPropertyTax + monthlyInsurance).toFixed(2)),
                    totalPayment: !isNaN(monthlyPayment + monthlyPropertyTax + monthlyInsurance) && numberWithCommas((monthlyPayment + monthlyPropertyTax + monthlyInsurance).toFixed(2)),
                    endingBalance: !isNaN(endingBalance) && numberWithCommas(endingBalance.toFixed(2)),
                    cumulativeInterest: !isNaN(cumulativeInterest) && numberWithCommas(cumulativeInterest.toFixed(2)),
                    cumulativePrincipal: !isNaN(cumulativePrincipal) && numberWithCommas(cumulativePrincipal.toFixed(2))
                });

                beginningBalance = endingBalance;

                if (endingBalance <= 0) break; // Exit loop if loan is fully paid off
            }

            setResults({
                principalInterest: numberWithCommas(principalInterest),
                taxesInsurance:  numberWithCommas(taxesInsurance),
                totalPayment: numberWithCommas(totalPayment),
                principalInterestPercent: numberWithCommas(principalInterestPercent),
                taxesInsurancePercent: numberWithCommas(taxesInsurancePercent),
                paymentBreakdown: {
                    labels: ['Principal & Interest', 'Taxes & Insurance'],
                    data: [principalInterestPercent, taxesInsurancePercent]
                },
                amortizationSchedule: monthlyAmortizationSchedule
            });
        } else {
            setResults({
                principalInterest: null,
                taxesInsurance: null,
                totalPayment: null,
                principalInterestPercent: null,
                taxesInsurancePercent: null,
                paymentBreakdown: null,
                amortizationSchedule: null
            });
        }

        // on change loan purpose
        setLoanPurpose_(formData.loanPurpose);
    }, [formData]);

    return <>
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Assumptions</h1>
            <form className="space-y-6">
                <div className="bgFormField p-4 rounded-lg shadow-sm">
                    <label htmlFor="loan-amount" className="block text-sm font-medium text-gray-600">
                        Loan Amount
                    </label>
                    <div className="relative mt-1 flex items-center">
                        <input
                            // type="number"
                            type="text"
                            id="loan-amount"
                            name="loanAmount"
                            value={formData.loanAmount}
                            onChange={handleChange}
                            step={incrementedValue}
                            placeholder="Enter loan amount"
                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="bgFormField p-4 rounded-lg shadow-sm">
                    <label htmlFor="loan-purpose" className="block text-sm font-medium text-gray-600">Loan Purpose</label>
                    <select
                        id="loan-purpose"
                        name="loanPurpose"
                        value={formData.loanPurpose}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        required
                    >
                        {loanPurpose()?.map((item) => (<option value={item}>{item}</option>))}
                    </select>
                </div>

                {
                    ( loanPurpose_ === 'Purchase' ) &&
                        <div className="bgFormField p-4 rounded-lg shadow-sm">
                            <label htmlFor="purchase-price" className="block text-sm font-medium text-gray-600">Purchase Price</label>
                            <div className="relative mt-1 flex items-center">
                                <input
                                    // type="number"
                                    type="text"
                                    id="purchase-price"
                                    name="purchasePrice"
                                    value={formData.purchasePrice}
                                    onChange={handleChange}
                                    step={incrementedValue}
                                    placeholder="Enter purchase price"
                                    className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>
                }

                {
                    ( loanPurpose_ === 'Refinance' ) &&
                        <div className="bgFormField p-4 rounded-lg shadow-sm">
                            <label htmlFor="purchase-price" className="block text-sm font-medium text-gray-600">Appraised Value</label>
                            <div className="relative mt-1 flex items-center">
                                <input
                                    // type="number"
                                    type="text"
                                    id="appraised-value"
                                    name="appraisedValue"
                                    value={formData.appraisedValue}
                                    onChange={handleChange}
                                    step={incrementedValue}
                                    placeholder="Enter appraised value"
                                    className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>
                }

                <div className="bgFormField p-4 rounded-lg shadow-sm">
                    <label htmlFor="loan-term" className="block text-sm font-medium text-gray-600">Loan Term (years)</label>
                    <select
                        id="loan-term"
                        name="loanTerm"
                        value={formData.loanTerm}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        required>{loanTermData()?.map((item) => (<option value={item}>{item}</option>))}
                    </select>
                </div>

                <div className="bgFormField p-4 rounded-lg shadow-sm">
                    <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-600">Interest Rate (%)</label>
                    <select
                        id="interest-rate"
                        name="interestRate"
                        value={formData.interestRate}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        required
                        placeholder="Select annual interest rate">{interestRateData()?.map((item) => (<option value={item}>{item}</option>))}
                    </select>
                </div>

                <div className="bgFormField p-4 rounded-lg shadow-sm">
                    <label htmlFor="property-tax" className="block text-sm font-medium text-gray-600">Property Tax (annual)</label>
                    <div className="relative mt-1 flex items-center">
                        <input
                            // type="number"
                            type="text"
                            id="property-tax"
                            name="propertyTax"
                            value={formData.propertyTax}
                            onChange={handleChange}
                            step={incrementedValue}
                            placeholder="Enter annual property tax"
                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="bgFormField p-4 rounded-lg shadow-sm">
                    <label htmlFor="insurance" className="block text-sm font-medium text-gray-600">Insurance</label>
                    <div className="relative mt-1 flex items-center">
                        <input
                            // type="number"
                            type="text"
                            id="insurance"
                            name="insurance"
                            value={formData.insurance}
                            onChange={handleChange}
                            step={incrementedValue}
                            placeholder="Enter insurance amount"
                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>
            </form>
        </div>
    </>;
}

export default Calculate;