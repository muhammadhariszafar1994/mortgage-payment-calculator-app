import { useEffect } from "react";

function SummaryResults({ summaryResults }) {
    useEffect(() => {
        console.log('summaryResults', summaryResults)
    }, [summaryResults]);

    return <>
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Summary Results</h2>
            
            <div className="space-y-4">
                <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-600">You can afford a home costing: </span>
                    <span className="text-gray-600">${summaryResults?.homeCosting ?? 0}</span>
                </div>

                <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-600">Monthly P&I payment is: </span>
                    <span className="text-gray-600">${summaryResults?.monthlyPI ?? 0}</span>
                </div>

                <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-600">Monthly T&I payment is: </span>
                    <span className="text-gray-600 font-semibold">${summaryResults?.monthlyTI ?? 0}</span>
                </div>

                <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-600">Total Monthly payment is: </span>
                    <span className="text-gray-600">${summaryResults?.maxHousingPayment ?? 0}</span>
                </div>
            </div>
        </div>
    </>;
}

export default SummaryResults;