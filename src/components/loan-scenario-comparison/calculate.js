import { useState, useEffect } from "react";
import { numberWithCommas, removeCommas, loanTermData } from "../../helper";

function Calculate({onCalculate}) {
    const [formData, setFormData] = useState({
        loanTerm: '0',
        interestRate: '0.00',
        loanAmount: '0',
        hoa: '0.00',
        insurance: '0.00'
    });

    // const [formData, setFormData] = useState({
    //     loanTerm: '30',
    //     interestRate: '6.35',
    //     loanAmount: '1200000',
    //     hoa: '50',
    //     insurance: '666.67'
    // });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = numberWithCommas(value);
        setFormData({
            ...formData,
            // [name]: value
            [name]: formattedValue
        });
    };

    const PMT = (monthlyInterestRate, numberOfPayments, loanAmount) => {
        if (monthlyInterestRate === 0) return -loanAmount / numberOfPayments;
    
        const denominator = 1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments);
        const pmt = (loanAmount * monthlyInterestRate) / denominator;
        
        return pmt;
    }

    const calculate = () => {
        const { loanTerm, interestRate, loanAmount, hoa, insurance } = formData;

        const _loanTerm = parseFloat(removeCommas(loanTerm));
        const _interestRate = parseFloat(removeCommas(interestRate));
        const _loanAmount = parseFloat(removeCommas(loanAmount));
        const _hoa = parseFloat(removeCommas(hoa));
        const _insurance = parseFloat(removeCommas(insurance));

        console.log('_loanTerm', _loanTerm);
        console.log('_interestRate', _interestRate);
        console.log('_loanAmount', _loanAmount);
        console.log('_hoa', _hoa);
        console.log('_insurance', _insurance);

        const results = [];
        const months = _loanTerm * 12;
        
        let beginningUpb = 0;
        let interestPayment = 0;
        let monthlyInterestRate = 0;
        let principalPayment = 0;
        let piPayment = 0;
        let impounds = 0;
        let totalPayment = 0;
        let endingBalance = 0;
        let cummulativeInterestPaid = 0;
        let cummulativePrincipalPaid = 0;

        for (let month = 1; month <= months; month++) {
            if (month === 1) beginningUpb = _loanAmount; 
            else beginningUpb = parseFloat(removeCommas(results[month-2]?.endingBalance));

            monthlyInterestRate = ((_interestRate / 100)/12);
            interestPayment = beginningUpb * monthlyInterestRate;

            piPayment = PMT(monthlyInterestRate, months, _loanAmount);
            

            principalPayment = piPayment - interestPayment;

            impounds = _hoa + _insurance;

            totalPayment = piPayment + impounds;

            endingBalance = beginningUpb - principalPayment;

            if (month === 1) cummulativeInterestPaid = interestPayment;
            else cummulativeInterestPaid = parseFloat(removeCommas(results[month-2]?.cummulativeInterestPaid)) + interestPayment;

            if (month === 1) cummulativePrincipalPaid = principalPayment;
            else cummulativePrincipalPaid = parseFloat(removeCommas(results[month-2]?.cummulativePrincipalPaid)) + principalPayment;

            const result = {
                month: month,
                beginningUpb: numberWithCommas(parseFloat(beginningUpb).toFixed(2)),
                interestPayment: numberWithCommas(parseFloat(interestPayment).toFixed(2)),
                principalPayment: numberWithCommas(parseFloat(principalPayment).toFixed(2)),
                piPayment: numberWithCommas(parseFloat(piPayment).toFixed(2)),
                impounds: numberWithCommas(parseFloat(impounds).toFixed(2)),
                totalPayment: numberWithCommas(parseFloat(totalPayment).toFixed(2)),
                endingBalance: numberWithCommas(parseFloat(endingBalance).toFixed(2)),
                cummulativeInterestPaid: numberWithCommas(parseFloat(cummulativeInterestPaid).toFixed(2)),
                cummulativePrincipalPaid: numberWithCommas(parseFloat(cummulativePrincipalPaid).toFixed(2))
            };

            results.push(result);

            // console.log(result);
        }

        return results;
    }

    useEffect(() => {
        onCalculate(calculate());
    }, [formData]);

    return (
        <>
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Home Affordability Model</h2>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6"> 
                        {/* Assmptions */}
                        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-600 mb-4">Loan Income</h3>
                            <div className="space-y-4">
                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-600">
                                        Loan Term (years)
                                    </label>
                                    <div className="relative mt-1 flex items-center">
                                        <select
                                            id="loanTerm"
                                            name="loanTerm"
                                            value={formData.loanTerm}
                                            onChange={handleChange}
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required>{loanTermData()?.map((item) => (<option value={item}>{item}</option>))}
                                        </select>
                                        {/* <input
                                            type="text"
                                            id="loanTerm"
                                            name="loanTerm"
                                            value={formData.loanTerm}
                                            onChange={handleChange}
                                            placeholder="Enter monthly loanTerm"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        /> */}
                                    </div>
                                </div>

                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-600">Interest Rate</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="text"
                                            id="interestRate"
                                            name="interestRate"
                                            value={formData.interestRate}
                                            onChange={handleChange}
                                            placeholder="Interest Rate"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-600">
                                        Loan Amount
                                    </label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="text"
                                            id="loanAmount"
                                            name="loanAmount"
                                            value={formData.loanAmount}
                                            onChange={handleChange}
                                            placeholder="Enter Loan Term (years)"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="hoa" className="block text-sm font-medium text-gray-600">HOA</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="text"
                                            id="hoa"
                                            name="hoa"
                                            value={formData.hoa}
                                            onChange={handleChange}
                                            placeholder="HOA"
                                            className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bgFormField p-4 rounded-lg shadow-sm">
                                    <label htmlFor="insurance" className="block text-sm font-medium text-gray-600">Insurance</label>
                                    <div className="relative mt-1 flex items-center">
                                        <input
                                            type="text"
                                            id="insurance"
                                            name="insurance"
                                            value={formData.insurance}
                                            onChange={handleChange}
                                            placeholder="Insurance"
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
        </>
    );
}

export default Calculate;