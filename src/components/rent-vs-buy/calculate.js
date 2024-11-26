import React, { useState, useEffect } from "react";
import { 
    rentIncreaseAndDecrease, 
    loanTermData, 
    interestRateData, 
    discountPointsData, 
    homeAppreciationAndDepreciationData,
    expectedYearsInHome,
    homeSellingCostsData,
    taxRateData,
    savingsRateData
} from "./variables/data";
import { 
    numberWithCommas, 
    removeCommas 
} from "../../helper";

const incrementedValue = 10000;

function Calculate({onCalculate}) {
    // const [formData, setFormData] = useState({
    //     rent: 700,
    //     insurance: 15,
    //     rentIncrease: 5,
    //     purchasePrice: 250000,
    //     downPayment: 50000,
    //     propertyTax: 3250,
    //     insuranceAnnual: 1000,
    //     maintenance: 700,
    //     term: 30,
    //     interestRate: '5.000',
    //     originationCharge: 1500,
    //     discountPoints: '1.000',
    //     otherServices: 1000,
    //     appreciationRate: '5.00',
    //     yearsInHome: 30,
    //     homeSellingCosts: '5.00',
    //     taxRate: 33.80,
    //     savingsRate: '1.00',
    //     homeDeductionAtSale: 500000
    // });

    const [formData, setFormData] = useState({
        rent: 0,
        insurance: 0,
        rentIncrease: 0,
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
        homeDeductionAtSale: 0
    });

    const PMT = (monthlyInterestRate, numberOfPayments, loanAmount) => {
        if (monthlyInterestRate === 0) return -loanAmount / numberOfPayments;
    
        const denominator = 1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments);
        const pmt = (loanAmount * monthlyInterestRate) / denominator;
        
        return pmt;
    }

    const calculateAdjustedRent = (initialRent, annualIncreaseRate, monthsElapsed) => {
        if (monthsElapsed === "") return "";
        
        // Calculate full years elapsed by rounding down
        const yearsElapsed = Math.floor((monthsElapsed - 1) / 12);
        
        // Calculate the adjusted rent based on yearsElapsed
        const adjustedRent = initialRent * Math.pow(1 + annualIncreaseRate / 100, yearsElapsed);
        
        return adjustedRent;
    };

    const calculateSellingCosts = (month, yearsInHome, homeValue, homeSellingCosts) => {
        const totalMonths = yearsInHome * 12; // Total number of months in the home
        if (month === totalMonths) {
            const sellingCosts = homeValue * (homeSellingCosts / 100); // Calculate selling costs
            return sellingCosts;
        }
        return 0; // No selling costs if not the final month
    };

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
            rentIncrease,
            homeDeductionAtSale
        } = formData;

        let presentValue = 0;

        const _rent = removeCommas(rent);
        const _insurance = removeCommas(insurance);
        const _purchasePrice = removeCommas(purchasePrice);
        const _downPayment = removeCommas(downPayment);
        const _propertyTax = removeCommas(propertyTax);
        const _insuranceAnnual = removeCommas(insuranceAnnual);
        const _maintenance = removeCommas(maintenance);
        const _term = removeCommas(term);
        const _interestRate = removeCommas(interestRate);
        const _originationCharge = removeCommas(originationCharge);
        const _discountPoints = removeCommas(discountPoints);
        const _appreciationRate = removeCommas(appreciationRate);
        const _yearsInHome = removeCommas(yearsInHome);
        const _homeSellingCosts = removeCommas(homeSellingCosts);
        const _taxRate = removeCommas(taxRate);
        const _savingsRate = removeCommas(savingsRate);
        const _rentIncrease = removeCommas(rentIncrease);
        const _homeDeductionAtSale = removeCommas(homeDeductionAtSale);
        
        const monthlyInterestRate = (parseFloat(_interestRate) / 100) / 12;

        /*** Actual ***/
        const numberOfPayments = parseFloat(_term) * 12; 
        // const numberOfPayments = parseFloat(_term) * 30;
        
        /*** Actual ***/
        // const loanAmount = parseFloat(purchasePrice) - parseFloat(downPayment);
        const loanAmount = (parseFloat(_purchasePrice) - parseFloat(_downPayment)) 
                   * (1 + parseFloat(_discountPoints) / 100) 
                   + parseFloat(_originationCharge);
        
        /*** Actual ***/
        // const discountPointsValue = parseFloat(discountPoints) / 100;
        // const totalLoanCostAdjustment = loanAmount * (1 + discountPointsValue) + parseFloat(originationCharge);
        // let presentValue = loanAmount * (1 + discountPointsValue) + parseFloat(originationCharge);
        // const monthlyPayment = PMT(monthlyInterestRate, numberOfPayments, totalLoanCostAdjustment);

        const monthlyPayment = PMT(monthlyInterestRate, numberOfPayments, loanAmount);
        
        let results = [];
        
        const totalRentExpenseArray = [];
        const totalHousingExpenseArray = [];
        const netBenefitArray = [];

        const months = parseFloat(_yearsInHome) * 12;

        for (let month = 1; month <= months; month++) {
            
            if (month === 1) {
                // Calculate the initial principal for the first month
                presentValue = (parseFloat(_purchasePrice) - parseFloat(_downPayment)) 
                                * (1 + (parseFloat(_discountPoints) / 100)) 
                                + parseFloat(_originationCharge);

                console.log('Month 1 Beginning principal', presentValue)
                console.log('')
                console.log('')
            } else {
                // For subsequent months, use the previous month's ending principal
                presentValue = parseFloat(results[month - 2]?.endingPrincipal); // Assuming results array stores previous calculations
            }


            const adjustedRent = calculateAdjustedRent(_rent, _rentIncrease, month)
            const interestPayment = presentValue * monthlyInterestRate;
            
            const principalPayment = monthlyPayment - interestPayment;
            
            let sumOfPrevInterestOnDownPaymentSavings = 0;
            for (let _month = 1; _month <= month; _month++) {
                sumOfPrevInterestOnDownPaymentSavings += (results[_month-1] && !isNaN(results[_month-1]?.interestOnDownPaymentSavings)) ? parseFloat(results[_month-1]?.interestOnDownPaymentSavings) : 0;
            }
            
            let interestOnDownPaymentSavings = (-_downPayment * Math.pow(1 + (_savingsRate / 100) / 12, month));
            interestOnDownPaymentSavings = interestOnDownPaymentSavings + parseFloat(_downPayment) - sumOfPrevInterestOnDownPaymentSavings
            
            const interestOnSavingsPostTax = Math.round(interestOnDownPaymentSavings * (1 - _taxRate / 100));

            /*** Actual ***/
            // const totalRentExpense = Math.round(parseFloat(rent) + parseFloat(insurance) + interestOnDownPaymentSavings);
            const totalRentExpense = parseFloat(adjustedRent) + parseFloat(_insurance) + interestOnDownPaymentSavings;
            console.log('totalRentExpense', totalRentExpense);
            
            const impounds = (_propertyTax / 12 + _insuranceAnnual / 12);

            const totalPayment = monthlyPayment + impounds;
            // const totalPayment = 869 + impounds;

            const endingPrincipal = parseFloat(presentValue).toFixed(2) - parseFloat(principalPayment).toFixed(2);
            // const endingPrincipal = Math.round(presentValue - principalPayment);

            console.log('beginningprincipal', presentValue);
            console.log('principalPayment', principalPayment)
            console.log('endingPrincipal', endingPrincipal);
            console.log('')
            
            
            
            const homeValue = parseFloat(_purchasePrice) * Math.pow(1 + ((_appreciationRate / 100) / 12), month);
            const homeEquity = homeValue - endingPrincipal;

            /*** Actual ***/
            // const sellingCosts = (month === (yearsInHome * 12)) ? homeValue * (homeSellingCosts / 100) : 0;
            const sellingCosts = calculateSellingCosts(month, _yearsInHome, homeValue, _homeSellingCosts);
            
            // sheet 2
            // const netGainBeforeTaxes =  (sellingCosts > 0) ? ((parseFloat(_purchasePrice) + sellingCosts) - homeValue) : 0;
            //sheet 5
            const netGainBeforeTaxes =  (sellingCosts > 0) ? (homeValue - (parseFloat(endingPrincipal) + parseFloat(_downPayment) + sellingCosts)) : 0;
            
            //  sheet 2
            //  const netGainAfterTaxes =  (sellingCosts > 0) ? (netGainBeforeTaxes * (1 - _taxRate / 100)) : 0;
            //  sheet 5
            const netGainAfterTaxes = (sellingCosts > 0) ? (netGainBeforeTaxes - ( netGainBeforeTaxes - _homeDeductionAtSale ) * (_taxRate / 100)) : 0;

            let totalHousingExpense = 0; 

            const totalMonths = yearsInHome * 12;

            // array of total rent expense
            totalRentExpenseArray.push(totalRentExpense);
            if (month === totalMonths) {
                // sheet 2
                // totalHousingExpense = totalPayment + (maintenance/12) + netGainAfterTaxes;
                totalHousingExpense = 0;
            
            } else totalHousingExpense = totalPayment + (_maintenance/12);
            
            totalHousingExpenseArray.push(totalHousingExpense);
            netBenefitArray.push(netGainAfterTaxes);

            results.push({
                month,
                // rent: !isNaN(rent) && parseFloat(rent).toFixed(2),
                rent: !isNaN(adjustedRent) && parseFloat(adjustedRent).toFixed(0),
                insurance: !isNaN(insurance) && numberWithCommas(parseFloat(insurance).toFixed(0)),
                interestOnDownPaymentSavings: !isNaN(interestOnDownPaymentSavings) && numberWithCommas(parseFloat(interestOnDownPaymentSavings).toFixed(2)),
                interestOnSavingsPostTax: !isNaN(interestOnSavingsPostTax) && numberWithCommas(parseFloat(interestOnSavingsPostTax).toFixed(0)),
                totalRentExpense: !isNaN(totalRentExpense) && numberWithCommas(parseFloat(totalRentExpense).toFixed(2)),
                beginningPrincipal: !isNaN(presentValue) && numberWithCommas(parseFloat(presentValue).toFixed(2)),
                interestPayment: !isNaN(interestPayment) && numberWithCommas(parseFloat(interestPayment).toFixed(0)),
                principalPayment: !isNaN(principalPayment) && numberWithCommas(parseFloat(principalPayment).toFixed(2)),
                principalAndInterestPayment: !isNaN(monthlyPayment) && numberWithCommas(parseFloat(monthlyPayment).toFixed(0)),
                impounds: !isNaN(impounds) && numberWithCommas(parseFloat(impounds).toFixed(0)),
                totalPayment: !isNaN(totalPayment) && numberWithCommas(parseFloat(totalPayment).toFixed(0)),
                endingPrincipal: !isNaN(endingPrincipal) && parseFloat(endingPrincipal),
                maintenanceExpense: !isNaN(maintenance/12) && numberWithCommas(parseFloat(maintenance/12).toFixed(0)),
                homeValue: !isNaN(homeValue) && numberWithCommas(parseFloat(homeValue).toFixed(0)),
                homeEquity: !isNaN(homeEquity) && numberWithCommas(parseFloat(homeEquity).toFixed(0)),
                sellingCosts: !isNaN(sellingCosts) && numberWithCommas(parseFloat(sellingCosts).toFixed(0)),
                netGainBeforeTaxes: !isNaN(netGainBeforeTaxes) && numberWithCommas(parseFloat(netGainBeforeTaxes).toFixed(2)),
                netGainAfterTaxes: !isNaN(netGainAfterTaxes) && numberWithCommas(parseFloat(netGainAfterTaxes).toFixed(2)),
                totalHousingExpense: !isNaN(totalHousingExpense) && numberWithCommas(parseFloat(totalHousingExpense).toFixed(0)),
            });

            // presentValue = endingPrincipal;
        }
        
        const costOfRenting = totalRentExpenseArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const costOfBuying = totalHousingExpenseArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const netBenefit = netBenefitArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const savingsByPurchasingOrRenting = Math.abs(parseFloat(netBenefit - costOfBuying) + parseFloat(costOfRenting - costOfBuying));
        
        // if(costOfRenting < costOfBuying) 
        //     savingsByPurchasingOrRenting = numberWithCommas(parseFloat((costOfBuying - costOfRenting)).toFixed(0));

        // else if(costOfRenting > costOfBuying) 
        //     savingsByPurchasingOrRenting = numberWithCommas(parseFloat((costOfRenting - costOfBuying)).toFixed(0));
        
        return {
            calculateMonthlyValues: results,
            summaryResultsValues: {
                costOfRenting: numberWithCommas(parseFloat(costOfRenting).toFixed(0)),
                costOfBuying: numberWithCommas(parseFloat(costOfBuying).toFixed(0)),
                netBenefit: numberWithCommas(parseFloat(netBenefit - costOfBuying).toFixed(0)),
                savingsByPurchasingOrRenting: numberWithCommas(parseFloat(savingsByPurchasingOrRenting).toFixed(0))
            }
        };
    };

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
                                            // type="number"
                                            type="text"
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
                                            // type="number"
                                            type="text"
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
                                    <label htmlFor="rentIncrease" className="block text-sm font-medium text-gray-600">
                                        Rent % Increase/(Decrease) (annual)
                                    </label>
                                    <div className="relative mt-1 flex items-center">
                                        <select
                                            id="rentIncrease"
                                            name="rentIncrease"
                                            value={formData.rentIncrease}
                                            onChange={handleChange}
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        >
                                            {rentIncreaseAndDecrease()?.map((item) => (<option value={item}>{item}%</option>))}
                                        </select>
                                        {/* <input
                                            // type="number"
                                            type="text"
                                            id="rentIncrease"
                                            name="rentIncrease"
                                            value={formData.rentIncrease}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter annual rent increase"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        /> */}
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
                                            // type="number"
                                            type="text"
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
                                            // type="number"
                                            type="text"
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
                                            // type="number"
                                            type="text"
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
                                            // type="number"
                                            type="text"
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
                                            // type="number"
                                            type="text"
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
                                    <label htmlFor="term" className="block text-sm font-medium text-gray-600">Loan Term (years)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <select
                                            id="term"
                                            name="term"
                                            value={formData.term}
                                            onChange={handleChange}
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required>{loanTermData()?.map((item) => (<option value={item}>{item}</option>))}
                                        </select>
                                        {/* <input
                                            // type="number"
                                            type="text"
                                            id="term"
                                            name="term"
                                            value={formData.term}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter loan term in years"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        /> */}
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-600">Interest Rate (%)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <select
                                            id="interestRate"
                                            name="interestRate"
                                            value={formData.interestRate}
                                            onChange={handleChange}
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required>{interestRateData()?.map((item) => (<option value={item}>{item}%</option>))}
                                        </select>
                                        {/* <input
                                            // type="number"
                                            type="text"
                                            id="interestRate"
                                            name="interestRate"
                                            value={formData.interestRate}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter annual interest rate"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        /> */}
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="originationCharge" className="block text-sm font-medium text-gray-600">Origination Charge</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            // type="number"
                                            type="text"
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
                                        <select
                                            id="discountPoints"
                                            name="discountPoints"
                                            value={formData.discountPoints}
                                            onChange={handleChange}
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required>{discountPointsData()?.map((item) => (<option value={item}>{item}%</option>))}
                                        </select>
                                        {/* <input
                                            type="text"
                                            id="discountPoints"
                                            name="discountPoints"
                                            value={formData.discountPoints}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter discount points"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        /> */}
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="otherServices" className="block text-sm font-medium text-gray-600">Other Settlement Services</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            // type="number"
                                            type="text"
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
                                        <select
                                            id="appreciationRate"
                                            name="appreciationRate"
                                            value={formData.appreciationRate}
                                            onChange={handleChange}
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required>{homeAppreciationAndDepreciationData()?.map((item) => (<option value={item}>{item}%</option>))}
                                        </select>
                                        {/* <input
                                            // type="number"
                                            type="text"
                                            id="appreciationRate"
                                            name="appreciationRate"
                                            value={formData.appreciationRate}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter appreciation/depreciation rate"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        /> */}
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="yearsInHome" className="block text-sm font-medium text-gray-600">Expected Years in Home</label>
                                    <div className="relative mt-1 flex items-center">
                                        <select
                                            id="yearsInHome"
                                            name="yearsInHome"
                                            value={formData.yearsInHome}
                                            onChange={handleChange}
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required>{expectedYearsInHome()?.map((item) => (<option value={item}>{item}</option>))}
                                        </select>
                                        
                                        {/* <input
                                            // type="number"
                                            type="text"
                                            id="yearsInHome"
                                            name="yearsInHome"
                                            value={formData.yearsInHome}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter expected years in home"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        /> */}
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="homeSellingCosts" className="block text-sm font-medium text-gray-600">Home Selling Costs (% of Selling Price)</label>
                                    <div className="relative mt-1 flex items-center">
                                        <select
                                            id="homeSellingCosts"
                                            name="homeSellingCosts"
                                            value={formData.homeSellingCosts}
                                            onChange={handleChange}
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required>{homeSellingCostsData()?.map((item) => (<option value={item}>{item}%</option>))}
                                        </select>
                                        
                                        {/* <input
                                            // type="number"
                                            type="text"
                                            id="homeSellingCosts"
                                            name="homeSellingCosts"
                                            value={formData.homeSellingCosts}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter home selling costs percentage"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        /> */}
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="taxRate" className="block text-sm font-medium text-gray-600">Tax Rate (Federal + State)</label>
                                    <div className="relative mt-1 flex items-center">
                                        {/* <select
                                            id="taxRate"
                                            name="taxRate"
                                            value={formData.taxRate}
                                            onChange={handleChange}
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required>{taxRateData()?.map((item) => (<option value={item}>{item}</option>))}
                                        </select> */}

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
                                            list="taxRateOptions"
                                        />
                                        <datalist id="taxRateOptions">
                                            {taxRateData()?.map((rate, index) => (
                                                <option key={index} value={rate} />
                                            ))}
                                        </datalist>
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="savingsRate" className="block text-sm font-medium text-gray-600">Savings Rate on Excess Funds</label>
                                    <div className="relative mt-1 flex items-center">
                                        <select
                                            id="savingsRate"
                                            name="savingsRate"
                                            value={formData.savingsRate}
                                            onChange={handleChange}
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required>{savingsRateData()?.map((item) => (<option value={item}>{item}%</option>))}
                                        </select>

                                        {/* <input
                                            type="text"
                                            id="savingsRate"
                                            name="savingsRate"
                                            value={formData.savingsRate}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter savings rate"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        /> */}
                                    </div>
                                </div>
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="otherServices" className="block text-sm font-medium text-gray-600">
                                        Home deduction (at sale)
                                    </label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            // type="number"
                                            type="text"
                                            id="homeDeductionAtSale"
                                            name="homeDeductionAtSale"
                                            value={formData.homeDeductionAtSale}
                                            onChange={handleChange}
                                            step={incrementedValue}
                                            placeholder="Enter home deduction (at sale)"
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