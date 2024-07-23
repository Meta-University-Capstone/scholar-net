import React, { useEffect, useRef } from 'react';

const RadarChart = ({ radarChartData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Function to calculate coordinates based on data and scale
    const calculateCoordinates = (data, maxValue, radius) => {
      const total = data.length;
      const angleIncrement = (2 * Math.PI) / total;
      const coordinates = [];

      data.forEach((value, index) => {
        const angle = index * angleIncrement - Math.PI / 2; // Starting from top
        const x = Math.cos(angle) * (value / maxValue) * radius;
        const y = Math.sin(angle) * (value / maxValue) * radius;
        coordinates.push({ x, y });
      });

      return coordinates;
    };

    // Function to render radar chart
    const renderRadarChart = () => {
      const maxValue = 100; // Assuming max value for each radar point
      const radius = 150; // Radius of the radar chart
      const centerX = radius + 20; // X coordinate for center of the chart
      const centerY = radius + 20; // Y coordinate for center of the chart

      radarChartData.forEach((data, index) => {
        const coordinates = calculateCoordinates(data.data, maxValue, radius);

        // Draw radar shape
        ctx.beginPath();
        ctx.moveTo(centerX + coordinates[0].x, centerY + coordinates[0].y);
        coordinates.forEach((coord, idx) => {
          ctx.lineTo(centerX + coord.x, centerY + coord.y);
        });
        ctx.closePath();

        // Set stroke and fill styles
        ctx.strokeStyle = `rgba(179, 181, 198, 1)`;
        ctx.fillStyle = `rgba(179, 181, 198, ${(index + 1) / 10})`;

        // Fill and stroke the path
        ctx.fill();
        ctx.stroke();

        // Render labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        coordinates.forEach((coord, idx) => {
          ctx.fillText(data.labels[idx], centerX + coord.x, centerY + coord.y);
        });
      });
    };

    // Clear canvas before each render
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render radar chart
    renderRadarChart();

  }, [radarChartData]);

  return (
    <div style={{ width: '500px', padding: '20px' }}>
      <h3>Radar Chart</h3>
      <canvas ref={canvasRef} width={300} height={300} />
    </div>
  );
};

export default RadarChart;
