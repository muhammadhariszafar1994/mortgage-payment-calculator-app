import React, { useState, useEffect } from "react";

const incrementedValue = 10000;

function Calculate({onCalculate}) {
   
    // const [formData, setFormData] = useState({
    //     rent: 700,
    //     insurance: 15,
    //     purchasePrice: 250000,
    //     downPayment: 50000,
    //     propertyTax: 3250,
    //     insuranceAnnual: 1000,
    //     maintenance: 700,
    //     term: 30,
    //     interestRate: 5.00,
    //     originationCharge: 1500,
    //     discountPoints: 1.00,
    //     otherServices: 1000,
    //     appreciationRate: 5.00,
    //     yearsInHome: 7,
    //     homeSellingCosts: 5.00,
    //     taxRate: 33.80,
    //     savingsRate: 1.00,
    // });

    const [formData, setFormData] = useState({
        rent: 0,
        insurance: 0,
        purchasePrice: 0,
        downPayment: 0,
        propertyTax: 0,
        insuranceAnnual: 0,
        maintenance: 0,
        term: 0,
        interestRate: 0,
        originationCharge: 0,
        discountPoints: 0,
        otherServices: 0,
        appreciationRate: 0,
        yearsInHome: 0,
        homeSellingCosts: 0,
        taxRate: 0,
        savingsRate: 0,
        rentIncrease: 0
    });

    const PMT = (monthlyInterestRate, numberOfPayments, loanAmount) => {
        if (monthlyInterestRate === 0) return -loanAmount / numberOfPayments;
    
        const denominator = 1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments);
        const pmt = (loanAmount * monthlyInterestRate) / denominator;
        
        return pmt;
    }

    const calculateMonthlyValues = () => {
        const {
            rent,
            insurance,
            purchasePrice,
            downPayment,
            propertyTax,
            insuranceAnnual,
            maintenance,
            term,
            interestRate,
            originationCharge,
            discountPoints,
            appreciationRate,
            yearsInHome,
            homeSellingCosts,
            taxRate,
            savingsRate,
        } = formData;

         
        const monthlyInterestRate = (parseFloat(interestRate) / 100) / 12;
        const numberOfPayments = parseFloat(term) * 12;
        const loanAmount = parseFloat(purchasePrice) - parseFloat(downPayment);
        const discountPointsValue = parseFloat(discountPoints) / 100;
        const totalLoanCostAdjustment = loanAmount * (1 + discountPointsValue) + parseFloat(originationCharge);

        let presentValue = loanAmount * (1 + discountPointsValue) + parseFloat(originationCharge);
        const monthlyPayment = PMT(monthlyInterestRate, numberOfPayments, totalLoanCostAdjustment)
        
        let results = [];

        const months = parseFloat(yearsInHome) * 12;

        for (let month = 1; month <= months; month++) {
            const interestPayment = Math.round(presentValue * monthlyInterestRate);
            
            const principalPayment = monthlyPayment - interestPayment;
            // const principalPayment = 869 - interestPayment;
            
            let sumOfPrevInterestOnDownPaymentSavings = 0;
            for (let _month = 1; _month <= month; _month++) {
                sumOfPrevInterestOnDownPaymentSavings += (results[_month-1] && !isNaN(results[_month-1]?.interestOnDownPaymentSavings)) ? parseFloat(results[_month-1]?.interestOnDownPaymentSavings) : 0;
            }
            
            let interestOnDownPaymentSavings = (-downPayment * Math.pow(1 + (savingsRate / 100) / 12, month));
            interestOnDownPaymentSavings = interestOnDownPaymentSavings + parseFloat(downPayment) - sumOfPrevInterestOnDownPaymentSavings
            
            const interestOnSavingsPostTax = Math.round(interestOnDownPaymentSavings * (1 - taxRate / 100));
            const totalRentExpense = Math.round(parseFloat(rent) + parseFloat(insurance) + interestOnDownPaymentSavings);
            const impounds = (propertyTax / 12 + insuranceAnnual / 12);

            const totalPayment = monthlyPayment + impounds;
            // const totalPayment = 869 + impounds;

            const endingPrincipal = presentValue - principalPayment;
            const homeValue = purchasePrice * Math.pow(1 + ((appreciationRate / 100) / 12), month);
            const homeEquity = homeValue - endingPrincipal;
            const sellingCosts = (month === (yearsInHome * 12)) ? homeValue * (homeSellingCosts / 100) : 0;
            const netGainBeforeTaxes =  (sellingCosts > 0) ? ((purchasePrice + sellingCosts) - homeValue) : 0;
            const netGainAfterTaxes =  (sellingCosts > 0) ? (netGainBeforeTaxes * (1 - taxRate / 100)) : 0;
            const totalHousingExpense = totalPayment + (maintenance/12);

            results.push({
                month,
                rent: !isNaN(rent) && parseFloat(rent).toFixed(2),
                insurance: !isNaN(insurance) && parseFloat(insurance).toFixed(2),
                interestOnDownPaymentSavings: !isNaN(interestOnDownPaymentSavings) && parseFloat(interestOnDownPaymentSavings).toFixed(2),
                interestOnSavingsPostTax: !isNaN(interestOnSavingsPostTax) && parseFloat(interestOnSavingsPostTax).toFixed(2),
                totalRentExpense: !isNaN(totalRentExpense) && parseFloat(totalRentExpense).toFixed(2),
                beginningPrincipal: !isNaN(presentValue) && parseFloat(presentValue).toFixed(2),
                interestPayment: !isNaN(interestPayment) && parseFloat(interestPayment).toFixed(2),
                principalPayment: !isNaN(principalPayment) && parseFloat(principalPayment).toFixed(2),
                principalAndInterestPayment: !isNaN(monthlyPayment) && parseFloat(monthlyPayment).toFixed(2),
                impounds: !isNaN(impounds) && parseFloat(impounds).toFixed(2),
                totalPayment: !isNaN(totalPayment) && parseFloat(totalPayment).toFixed(2),
                endingPrincipal: !isNaN(endingPrincipal) && parseFloat(endingPrincipal).toFixed(2),
                maintenanceExpense: !isNaN(maintenance/12) && parseFloat(maintenance/12).toFixed(2),
                homeValue: !isNaN(homeValue) && parseFloat(homeValue).toFixed(2),
                homeEquity: !isNaN(homeEquity) && parseFloat(homeEquity).toFixed(2),
                sellingCosts: !isNaN(sellingCosts) && parseFloat(sellingCosts).toFixed(2),
                netGainBeforeTaxes: !isNaN(netGainBeforeTaxes) && parseFloat(netGainBeforeTaxes).toFixed(2),
                netGainAfterTaxes: !isNaN(netGainAfterTaxes) && parseFloat(netGainAfterTaxes).toFixed(2),
                totalHousingExpense: !isNaN(totalHousingExpense) && parseFloat(totalHousingExpense).toFixed(2),
            });

            presentValue = endingPrincipal;
        }
        
        return results;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    useEffect(() => {
        onCalculate(calculateMonthlyValues());
    }, [formData]);

    return <>
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Financial Information Form</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6"> 
                        {/* Renting Section */}
                        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-600 mb-4">Renting</h3>
                            <div className="space-y-4">
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="rent" className="block text-sm font-medium text-gray-600">Rent (monthly)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="rent"
                                            name="rent"
                                            value={formData.rent}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter monthly rent"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="insurance" className="block text-sm font-medium text-gray-600">Renter's Insurance (monthly)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="insurance"
                                            name="insurance"
                                            value={formData.insurance}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter monthly insurance"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="rentIncrease" className="block text-sm font-medium text-gray-600">Rent % Increase/(Decrease) (annual)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="rentIncrease"
                                            name="rentIncrease"
                                            value={formData.rentIncrease}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter annual rent increase"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Home Purchase Section */}
                        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-600 mb-4">Home Purchase</h3>
                            <div className="space-y-4">
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-600">Purchase Price</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="purchasePrice"
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
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="downPayment" className="block text-sm font-medium text-gray-600">Down Payment</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="downPayment"
                                            name="downPayment"
                                            value={formData.downPayment}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter down payment"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="propertyTax" className="block text-sm font-medium text-gray-600">Property Tax (annual)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="propertyTax"
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
                                    <label htmlFor="insuranceAnnual" className="block text-sm font-medium text-gray-600">Homeowner's Insurance (annual)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="insuranceAnnual"
                                            name="insuranceAnnual"
                                            value={formData.insuranceAnnual}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter annual homeowner's insurance"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="maintenance" className="block text-sm font-medium text-gray-600">Maintenance (annual)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="maintenance"
                                            name="maintenance"
                                            value={formData.maintenance}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter annual maintenance cost"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Loan Info Section */}
                        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-600 mb-4">Loan Info</h3>
                            <div className="space-y-4">
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="term" className="block text-sm font-medium text-gray-600">Term (years)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="term"
                                            name="term"
                                            value={formData.term}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter loan term in years"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-600">Interest Rate (%)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="interestRate"
                                            name="interestRate"
                                            value={formData.interestRate}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter annual interest rate"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="originationCharge" className="block text-sm font-medium text-gray-600">Origination Charge</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="originationCharge"
                                            name="originationCharge"
                                            value={formData.originationCharge}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter origination charge"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="discountPoints" className="block text-sm font-medium text-gray-600">Discount Points</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="text"
                                            id="discountPoints"
                                            name="discountPoints"
                                            value={formData.discountPoints}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter discount points"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="otherServices" className="block text-sm font-medium text-gray-600">Other Settlement Services</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="otherServices"
                                            name="otherServices"
                                            value={formData.otherServices}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter other settlement services"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Other Assumptions Section */}
                        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-600 mb-4">Other Assumptions</h3>
                            <div className="space-y-4">
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="appreciationRate" className="block text-sm font-medium text-gray-600">Home Appreciation/Depreciation Rate (annual)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="appreciationRate"
                                            name="appreciationRate"
                                            value={formData.appreciationRate}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter appreciation/depreciation rate"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="yearsInHome" className="block text-sm font-medium text-gray-600">Expected Years in Home</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="yearsInHome"
                                            name="yearsInHome"
                                            value={formData.yearsInHome}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter expected years in home"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="homeSellingCosts" className="block text-sm font-medium text-gray-600">Home Selling Costs (% of Selling Price)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="number"
                                            id="homeSellingCosts"
                                            name="homeSellingCosts"
                                            value={formData.homeSellingCosts}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter home selling costs percentage"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="taxRate" className="block text-sm font-medium text-gray-600">Tax Rate (Federal + State)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="text"
                                            id="taxRate"
                                            name="taxRate"
                                            value={formData.taxRate}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter tax rate"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="savingsRate" className="block text-sm font-medium text-gray-600">Savings Rate on Excess Funds</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="text"
                                            id="savingsRate"
                                            name="savingsRate"
                                            value={formData.savingsRate}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter savings rate"
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