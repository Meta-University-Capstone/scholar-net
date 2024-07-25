import React from 'react';
import { Radar } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js';
import {LineElement, PointElement, Tooltip, Legend, RadialLinearScale, Filler } from 'chart.js';


ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const SimpleRadar = () => {
  const data = {
    labels: ['Age', 'GPA', 'Personal Statement', 'Interests'],
    datasets: [
      {
        label: 'Student 1',
        data: [18, 3.5, 4.5, 8],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Student 2',
        data: [20, 3.2, 4.2, 6],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };


  const options = {

  }

  return (
    <div style= {{width: "500px", padding: 20}}>
    <Radar
    data={data}
    options={options}>

    </Radar>
    </div>




  );
};

export default SimpleRadar;
