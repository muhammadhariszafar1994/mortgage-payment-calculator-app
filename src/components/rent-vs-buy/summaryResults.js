function SummaryResults({ summaryResults }) {
    return <>
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Summary Results</h2>
            
            <div className="space-y-4">
                <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-600">Cost of Renting (Cumulative):</span>
                    <span className="text-gray-600">${summaryResults?.costOfRenting}</span>
                </div>

                <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-600">Cost of Buying:</span>
                    <span className="text-gray-600">${summaryResults?.costOfBuying}</span>
                </div>

                <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-600">Decision:</span>
                    <span className="text-gray-600 font-semibold">More Beneficial to Purchase</span>
                </div>

                <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-600">Savings by Purchasing:</span>
                    <span className="text-gray-600">${summaryResults?.savingsByPurchasingOrRenting}</span>
                </div>
            </div>
        </div>
    </>;
}

export default SummaryResults;