import React, { useState, useEffect } from "react";
import { numberWithCommas, removeCommas } from "../../helper";
import { interestRateData } from "./variables/data";

const incrementedValue = 10000;





function Calculate({onCalculate}) {
    // const [formData, setFormData] = useState({
    //     loanTerm: '0',
    //     downPayment: '0',
    //     interestRate: '0.000',
    //     grossIncomeAnnual: '0',
    //     debtPaymentsMonthly: '0',
    //     debtToIncomeRatio: '0.00',
    //     housingRatio: '0.00',
    //     propertyTaxesAnnual: '0',
    //     homeownersInsurance: '0',
    //     hoaMonthly: '0'
    // });

    const [formData, setFormData] = useState({
        loanTerm: '30',
        downPayment: '50,000',
        interestRate: '5.000',
        grossIncomeAnnual: '75,000',
        debtPaymentsMonthly: '250',
        debtToIncomeRatio: '36.00',
        housingRatio: '28.00',
        propertyTaxesAnnual: '3,250',
        homeownersInsurance: '1,000',
        hoaMonthly: '0'
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

    const pvFunc = (rate, nper, pmt, fv = 0, type = 0) => {
        if (rate === 0) {
            return -((pmt * nper) + fv);
        }
        return (
            -pmt * (1 + rate * type) * (1 - Math.pow(1 + rate, -nper)) / rate -
            (fv * Math.pow(1 + rate, -nper))
        );
    };

    // stackoverflow code
    const trunc = (x, posiciones = 0) => {
        var s = x.toString()
        var l = s.length
        var decimalLength = s.indexOf('.') + 1
        var numStr = s.substr(0, decimalLength + posiciones)
        return Number(numStr)
    }
      
    const conv_number =(expr, decplaces) => {
        var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));
        while (str.length <= decplaces) {
          str = "0" + str;
        }
        var decpoint = str.length - decplaces;
        return (str.substring(0, decpoint) + "." + str.substring(decpoint, str.length));
    }
      
    const pv =(rate, nper, pmt, fv = 0, type = 0) => {
        console.log('rate, nper, pmt, fv', rate, nper, pmt, fv)
        
        let pv_value = 0;
        let x = 0;
        let y = 0;

        if (rate == 0){ 
          pv_value = -(fv + (pmt * nper));
        } else {
          x = Math.pow(1 + rate, -nper);
          y = Math.pow(1 + rate, nper);
          pv_value = -(x * (fv * rate - pmt + y * pmt)) / rate;
        }
        pv_value = conv_number(pv_value, 2);
        return (trunc(pv_value*-1, 2));
    }
    // stackoverflow code


    // calculation
    const calculate = () => {
        const {
            loanTerm,
            downPayment,
            interestRate,
            grossIncomeAnnual,
            debtPaymentsMonthly,
            debtToIncomeRatio,
            housingRatio,
            propertyTaxesAnnual,
            homeownersInsurance,
            hoaMonthly
        } = formData;

        const _loanTerm = parseFloat(removeCommas(loanTerm));
        const _downPayment = parseFloat(removeCommas(downPayment));
        const _interestRate = parseFloat(removeCommas(interestRate));
        const _grossIncomeAnnual = parseFloat(removeCommas(grossIncomeAnnual));
        const _debtPaymentsMonthly = parseFloat(removeCommas(debtPaymentsMonthly));
        const _debtToIncomeRatio = parseFloat(removeCommas(debtToIncomeRatio)) / 100;
        const _housingRatio = parseFloat(removeCommas(housingRatio)) / 100;
        const _propertyTaxesAnnual = parseFloat(removeCommas(propertyTaxesAnnual));
        const _homeownersInsurance = parseFloat(removeCommas(homeownersInsurance));
        const _hoaMonthly = parseFloat(removeCommas(hoaMonthly));
        
        const monthlyGrossIncome = _grossIncomeAnnual / 12;
        const maxTotalDebtPayments = monthlyGrossIncome * _debtToIncomeRatio;
        const maxHousingPayment = maxTotalDebtPayments - _debtPaymentsMonthly;
        const monthlyPropertyTaxes = _propertyTaxesAnnual / 12;
        const monthlyHomeownersInsurance = _homeownersInsurance / 12;
        const monthlyTI = monthlyPropertyTaxes + monthlyHomeownersInsurance + _hoaMonthly;
        const monthlyPI = maxHousingPayment - monthlyTI;
        const monthlyInterestRate = _interestRate / 100 / 12;
        const numberOfPayments = _loanTerm * 12;
        
        const presentValue = -pv(monthlyInterestRate, numberOfPayments, -monthlyPI);

        const homeCosting = presentValue + _downPayment;

        console.log("Loan Amount:", presentValue);
        console.log("Total Home Price:", homeCosting);
        console.log("Monthly P&I Payment:", monthlyPI);
        console.log("Monthly T&I Payment:", monthlyTI);
        console.log("Total Monthly Payment (PITI):", maxHousingPayment);

        return {
            summaryResultsValues: {
                homeCosting: Math.round(homeCosting),
                monthlyPI: Math.round(monthlyPI),
                monthlyTI: Math.round(monthlyTI),
                maxHousingPayment: Math.round(maxHousingPayment)
            }
        };
    }

    useEffect(() => {
        onCalculate(calculate());
    }, [formData]);

    return <>
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Home Affordability Model</h2>
            <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6"> 
                    {/* Loan Income Section */}
                    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-600 mb-4">Loan Income</h3>
                        <div className="space-y-4">
                            <div className="bgFormField p-4 rounded-lg shadow-sm">
                                <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-600">Loan Term (years)</label>
                                <div className="relative mt-1 flex items-center">
                                    <input
                                        type="text"
                                        id="loanTerm"
                                        name="loanTerm"
                                        value={formData.loanTerm}
                                        onChange={handleChange}
                                        step={incrementedValue}
                                        placeholder="Enter monthly loanTerm"
                                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="bgFormField p-4 rounded-lg shadow-sm">
                                <label htmlFor="downPayment" className="block text-sm font-medium text-gray-600">Down Payment</label>
                                <div className="relative mt-1 flex items-center">
                                    <input
                                        type="text"
                                        id="downPayment"
                                        name="downPayment"
                                        value={formData.downPayment}
                                        onChange={handleChange}
                                        step={incrementedValue}
                                        placeholder="Down Payment"
                                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="bgFormField p-4 rounded-lg shadow-sm">
                                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-600">
                                    Interest Rate
                                </label>
                                <div className="relative mt-1 flex items-center">
                                    <select
                                        id="interestRate"
                                        name="interestRate"
                                        value={formData.interestRate}
                                        onChange={handleChange}
                                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                        required>{interestRateData()?.map((item) => (<option value={item}>{item}%</option>))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Income / Expense Section */}
                    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-600 mb-4">Income / Expense</h3>
                        <div className="space-y-4">
                            <div className="bgFormField p-4 rounded-lg shadow-sm">
                                <label htmlFor="grossIncomeAnnual" className="block text-sm font-medium text-gray-600">
                                    Gross Income (annual)
                                </label>
                                <div className="relative mt-1 flex items-center">
                                    <input
                                        type="text"
                                        id="grossIncomeAnnual"
                                        name="grossIncomeAnnual"
                                        value={formData.grossIncomeAnnual}
                                        onChange={handleChange}
                                        step={incrementedValue}
                                        placeholder="Gross Income Annual"
                                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="bgFormField p-4 rounded-lg shadow-sm">
                                <label htmlFor="debtPaymentsMonthly" className="block text-sm font-medium text-gray-600">
                                    Debt Payments (monthly)
                                </label>
                                <div className="relative mt-1 flex items-center">
                                    <input
                                        type="text"
                                        id="debtPaymentsMonthly"
                                        name="debtPaymentsMonthly"
                                        value={formData.debtPaymentsMonthly}
                                        onChange={handleChange}
                                        step={incrementedValue}
                                        placeholder="Gross Income Annual"
                                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="bgFormField p-4 rounded-lg shadow-sm">
                                <label htmlFor="debtToIncomeRatio" className="block text-sm font-medium text-gray-600">
                                    Debt-to-Income Ratio
                                </label>
                                <div className="relative mt-1 flex items-center">
                                    <input
                                        type="text"
                                        id="debtToIncomeRatio"
                                        name="debtToIncomeRatio"
                                        value={formData.debtToIncomeRatio}
                                        onChange={handleChange}
                                        step={incrementedValue}
                                        placeholder="Gross Income Annual"
                                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="bgFormField p-4 rounded-lg shadow-sm">
                                <label htmlFor="housingRatio" className="block text-sm font-medium text-gray-600">
                                    Housing Ratio
                                </label>
                                <div className="relative mt-1 flex items-center">
                                    <input
                                        type="text"
                                        id="housingRatio"
                                        name="housingRatio"
                                        value={formData.housingRatio}
                                        onChange={handleChange}
                                        step={incrementedValue}
                                        placeholder="Gross Income Annual"
                                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Taxes & Insurance Section */}
                    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-600 mb-4">Taxes & Insurance</h3>
                        <div className="space-y-4">
                            <div className="bgFormField p-4 rounded-lg shadow-sm">
                                <label htmlFor="propertyTaxesAnnual" className="block text-sm font-medium text-gray-600">
                                    Property Taxes (annual)
                                </label>
                                <div className="relative mt-1 flex items-center">
                                    <input
                                        type="text"
                                        id="propertyTaxesAnnual"
                                        name="propertyTaxesAnnual"
                                        value={formData.propertyTaxesAnnual}
                                        onChange={handleChange}
                                        step={incrementedValue}
                                        placeholder="Property Taxes Annual"
                                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="bgFormField p-4 rounded-lg shadow-sm">
                                <label htmlFor="homeownersInsurance" className="block text-sm font-medium text-gray-600">
                                    Homeowners Insurance
                                </label>
                                <div className="relative mt-1 flex items-center">
                                    <input
                                        type="text"
                                        id="homeownersInsurance"
                                        name="homeownersInsurance"
                                        value={formData.homeownersInsurance}
                                        onChange={handleChange}
                                        step={incrementedValue}
                                        placeholder="Homeowners Insurance"
                                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="bgFormField p-4 rounded-lg shadow-sm">
                                <label htmlFor="hoaMonthly" className="block text-sm font-medium text-gray-600">
                                    HOA (monthly)
                                </label>
                                <div className="relative mt-1 flex items-center">
                                    <input
                                        type="text"
                                        id="hoaMonthly"
                                        name="hoaMonthly"
                                        value={formData.hoaMonthly}
                                        onChange={handleChange}
                                        step={incrementedValue}
                                        placeholder="HOA (monthly)"
                                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </>;
}

export default Calculate;