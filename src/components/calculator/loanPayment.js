import React from "react";

function LoanPayment({results}) {
    return <>
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Loan Payment</h1>
            <div className="mt-4">
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="p-4 text-left">Description</th>
                            <th className="p-4 text-left">Amount</th>
                            <th className="p-4 text-left">% of Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b border-gray-200 hover:bg-blue-50">
                            <td className="p-4 text-gray-800"><strong>Principal & Interest:</strong></td>
                            <td className="p-4 text-gray-800">{results?.principalInterest ? ('$ '+results?.principalInterest) : 'N/A'}</td>
                            <td className="p-4 text-gray-800">{results?.principalInterestPercent ? (results?.principalInterestPercent + '%') : 'N/A'}</td>
                        </tr>
                        <tr className="bg-gray-50 border-b border-gray-200 hover:bg-blue-50">
                            <td className="p-4 text-gray-800"><strong>Taxes & Insurance:</strong></td>
                            <td className="p-4 text-gray-800">{results?.taxesInsurance ? ('$ '+results?.taxesInsurance) : 'N/A'}</td>
                            <td className="p-4 text-gray-800">{results?.taxesInsurancePercent ? (results?.taxesInsurancePercent + '%') : 'N/A'}</td>
                        </tr>
                        <tr className="bg-white hover:bg-blue-50">
                            <td className="p-4 text-gray-800"><strong>Total Payment:</strong></td>
                            <td className="p-4 text-gray-800">{results?.totalPayment ? ('$ '+results?.totalPayment) : 'N/A'}</td>
                            <td className="p-4 text-gray-800"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </>;
}

export default LoanPayment;