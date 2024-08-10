// components/PlayerChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PlayerChartProps {
    data: { time: string, totalPlayers: number }[];
}

const PlayerChart: React.FC<PlayerChartProps> = ({ data }) => {
    console.log('PlayerChart data:', data); // Debugging log

    const chartData = {
        labels: data.map(entry => entry.time),
        datasets: [
            {
                label: 'Total Players',
                data: data.map(entry => entry.totalPlayers),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Total Players Over Time',
            },
        },
    };

    return (
        <div className="chart-container">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default PlayerChart;