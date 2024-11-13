import React from "react";

function MonthlyAmortizationDetail({results}) {
    return <>
        {
            results?.amortizationSchedule?.length > 0 ? (
                <>
                    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Monthly Amortization Detail</h1>
                        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bgSecondary text-white">
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Month</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Beginning UPB</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Interest Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Principal Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">P&I Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Impounds</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ending Balance</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cummulative Interest Paid</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cummulative Principal Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results?.amortizationSchedule?.map((item, index) => (
                                    <tr key={index} className="bg-white border-b border-gray-200 hover:bg-blue-50">
                                        <td className="p-4 text-gray-800">{item.month}</td>
                                        <td className="p-4 text-gray-800">{item.beginningBalance}</td>
                                        <td className="p-4 text-gray-800">{item.interestPayment}</td>
                                        <td className="p-4 text-gray-800">{item.principalPayment}</td>
                                        <td className="p-4 text-gray-800">{item.pAndiPayment}</td>
                                        <td className="p-4 text-gray-800">{item.impounds}</td>
                                        <td className="p-4 text-gray-800">{item.totalPayment}</td>
                                        <td className="p-4 text-gray-800">{item.endingBalance}</td>
                                        <td className="p-4 text-gray-800">{item.cumulativeInterest}</td>
                                        <td className="p-4 text-gray-800">{item.cumulativePrincipal}</td>
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
    </>;
}

export default MonthlyAmortizationDetail;