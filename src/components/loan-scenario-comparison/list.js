function List({ results }) {
    return <>
        <div className="container mx-auto">
            {
                results?.length > 0 ? (
                    <>
                        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 overflow-auto" style={{height: '800px'}}>
                            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Loan Scenario Comparison Detail</h1>
                            <table className="min-w-full border border-gray-300 rounded-lg ">
                                <thead className="bg-gray-50">
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
                                <tbody className="bg-white border-b border-gray-200 hover:bg-blue-50">
                                    {results.map((row) => (
                                        <tr key={row.month} className="bg-white border-b border-gray-200 hover:bg-blue-50">
                                            <td className="p-4 text-gray-800">{row.month}</td>
                                            <td className="p-4 text-gray-800">{row.beginningUpb}</td>
                                            <td className="p-4 text-gray-800">{row.interestPayment}</td>
                                            <td className="p-4 text-gray-800">{row.principalPayment}</td>
                                            <td className="p-4 text-gray-800">{row.piPayment}</td>
                                            <td className="p-4 text-gray-800">{row.impounds}</td>
                                            <td className="p-4 text-gray-800">{row.totalPayment}</td>
                                            <td className="p-4 text-gray-800">{row.endingBalance}</td>
                                            <td className="p-4 text-gray-800">{row.cummulativeInterestPaid}</td>
                                            <td className="p-4 text-gray-800">{row.cummulativePrincipalPaid}</td>
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
    </>;
}

export default List;