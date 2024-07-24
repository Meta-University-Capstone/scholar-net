import React, { useEffect, useRef } from 'react';

const RadarChart = ({ radarChartData, legendData }) => {
  const canvasRef = useRef(null);
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const calculateCoordinates = (data, maxValue, radius) => {
      const total = data.length;
      const angleIncrement = (2 * Math.PI) / total;
      const coordinates = [];

      data.forEach((value, index) => {
        const angle = index * angleIncrement - Math.PI / 2;
        const x = Math.cos(angle) * (value / maxValue) * radius;
        const y = Math.sin(angle) * (value / maxValue) * radius;
        coordinates.push({ x, y });
      });

      return coordinates;
    };

    const renderRadarChart = () => {
      const maxValue = 20;
      const radius = Math.min(canvas.width / 2, canvas.height / 2) - 50;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!radarChartData || radarChartData.length === 0) {
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.fillText('Select Students to get started!', centerX - 100, centerY);
        return;
      }

      const numGrids = 4;
      const gridStep = radius / numGrids;

      ctx.strokeStyle = '#ccc';
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 1; i <= numGrids; i++) {
        const circleRadius = i * gridStep;
        ctx.beginPath();
        ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
        ctx.stroke();

        const textOffset = 10;

        ctx.fillText(i * 5, centerX, centerY - circleRadius + textOffset);
        ctx.fillText(i * 5, centerX, centerY + circleRadius - textOffset);
        ctx.fillText(i * 5, centerX - circleRadius + textOffset, centerY);
        ctx.fillText(i * 5, centerX + circleRadius - textOffset, centerY);
      }

      ctx.font = '18px Arial';

      radarChartData.forEach((data, index) => {
        if (!data || !data.data || !data.labels || data.data.length !== data.labels.length) {
          console.error(`Invalid data structure for radarChartData at index ${index}`);
          return;
        }

        const coordinates = calculateCoordinates(data.data, maxValue, radius);

        ctx.beginPath();
        ctx.moveTo(centerX + coordinates[0].x, centerY + coordinates[0].y);

        ctx.fillStyle = colors[index % colors.length];

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        coordinates.forEach((coord, idx) => {
          ctx.lineTo(centerX + coord.x, centerY + coord.y);
        });

        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        coordinates.forEach((coord, idx) => {
          const angle = idx * (2 * Math.PI) / data.data.length - Math.PI / 2;
          const labelX = centerX + Math.cos(angle) * (radius + 30);
          const labelY = centerY + Math.sin(angle) * (radius + 30);
          ctx.fillStyle = '#333';
          ctx.font = '12px Arial';
          ctx.textAlign = Math.cos(angle) > 0 ? 'left' : 'right';
          ctx.textBaseline = 'middle';
          ctx.fillText(data.labels[idx], labelX, labelY);
        });
      });
    };

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      renderRadarChart();
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };

  }, [radarChartData, legendData]);

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h3>Radar Chart</h3>
      <canvas ref={canvasRef} style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}></canvas>
      {radarChartData.map((data, index) => (
          <div key={index} style={{ color: colors[index % colors.length], margin: '10px 0' }}>
            {data.name}
          </div>))}
    </div>
  );
};

export default RadarChart;
