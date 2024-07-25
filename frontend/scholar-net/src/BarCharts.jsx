import React, { useEffect, useRef } from 'react';
import './BarCharts.css';

const BarCharts = ({ radarChartData }) => {
  const labels = ["Age", "GPA", "Personal Statement", "Interests"];
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const getMaxValueForLabel = (labelIndex) => {
    switch (labelIndex) {
      case 0: return 20;
      case 1: return 4.0;
      case 2:
      case 3: return 10;
      default: return 10;
    }
  };

  const maxValues = labels.map((_, index) => getMaxValueForLabel(index));
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const renderBarCharts = () => {
      const barHeight = 20;
      const barSpacing = 40;
      const baseX = 200;
      let baseY = 50;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!radarChartData || radarChartData.length === 0) {
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.fillText('Select Students to get started!', baseX, baseY);
        return;
      }

      labels.forEach((label, labelIndex) => {
        const maxValueForLabel = maxValues[labelIndex];
        const totalWidth = canvas.width - baseX - 100;

        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.fillText(label, 10, baseY + barHeight / 2);

        radarChartData.forEach((data, index) => {
          const value = data.data[labelIndex];
          const barWidth = (value / maxValueForLabel) * totalWidth;

          ctx.fillStyle = '#000';
          ctx.fillText(data.name, 10, baseY + barHeight / 2 + 20);


          ctx.fillStyle = colors[index % colors.length];
          ctx.fillRect(baseX, baseY, barWidth, barHeight);

          baseY += barHeight + barSpacing;
        });


        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(baseX + totalWidth, baseY);
        ctx.strokeStyle = '#000';
        ctx.stroke();

        ctx.fillStyle = '#000';
        for (let i = 0; i <= maxValueForLabel; i++) {
          const x = baseX + (i / maxValueForLabel) * totalWidth;
          ctx.fillText(i, x, baseY + 15);
          ctx.moveTo(x, baseY);
          ctx.lineTo(x, baseY + 5);
          ctx.stroke();
        }

        baseY += 2 * barSpacing;
      });
    };

    renderBarCharts();

  }, [radarChartData, maxValues]);

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h3>Bar Charts</h3>
      <canvas ref={canvasRef} width={1000} height={850} style={{ border: '1px solid #ccc' }}></canvas>
    </div>
  );
};

export default BarCharts;
