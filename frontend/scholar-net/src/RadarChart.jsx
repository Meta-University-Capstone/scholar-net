import React from 'react';
import { Radar } from 'react-chartjs-2';

const RadarChart = ({ labels, data }) => {
  const radarData = {
    labels: ['Age', 'GPA', 'Personal Statement', 'Interests'],
    datasets: radarChartData.map((data, index) => ({
      label: `Student ${index + 1}`,
      backgroundColor: `rgba(179, 181, 198, ${(index + 1) / 10})`,
      borderColor: `rgba(179, 181, 198, 1)`,
      pointBackgroundColor: `rgba(179, 181, 198, 1)`,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: `rgba(179, 181, 198, 1)`,
      data: data.data,
    })),
  };

  const radarOptions = {
    scale: {
      ticks: { beginAtZero: true },
    },
  };

  return <Radar data={radarData} options={radarOptions} />;
};

export default RadarChart;
