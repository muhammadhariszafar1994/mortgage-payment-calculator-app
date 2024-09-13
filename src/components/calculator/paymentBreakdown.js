import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

function PaymentBreakdown({results}) {
    const data = {
        labels: results?.paymentBreakdown?.labels ?? ['Principal & Interest', 'Taxes & Insurance'],
        datasets: [
            {
                label: 'Payment Breakdown',
                data: results?.paymentBreakdown?.data ?? [1, 1],
                backgroundColor: ['#2563eb', '#eff6ff'],
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw;
                    },
                },
            },
        },
    };

    return <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Payment Breakdown</h1>
            <Pie data={data} options={options} />
        </>;
}

export default PaymentBreakdown;