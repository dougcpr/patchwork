import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import type { ChartOptions } from 'chart.js';
import type {Climb} from "./App.tsx";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const colorMap: Record<string, string> = {
  V0: 'rgba(255, 99, 132, 0.6)',
  V1: 'rgba(54, 162, 235, 0.6)',
  V2: 'rgba(255, 206, 86, 0.6)',
  V3: 'rgba(75, 192, 192, 0.6)',
  V4: 'rgba(153, 102, 255, 0.6)',
  V5: 'rgba(255, 159, 64, 0.6)',
};

const fadedColorMap: Record<string, string> = {
  V0: 'rgba(255, 99, 132, 0.3)',
  V1: 'rgba(54, 162, 235, 0.3)',
  V2: 'rgba(255, 206, 86, 0.3)',
  V3: 'rgba(75, 192, 192, 0.3)',
  V4: 'rgba(153, 102, 255, 0.3)',
  V5: 'rgba(255, 159, 64, 0.3)',
};

const GradeChart = ({data}: { data?: Climb[] }) => {

  const chartData = useMemo(() => {
    if (!data) return null;

    const gradeMap: Record<string, { completed: number; notCompleted: number }> = {};

    data.forEach((climb: any) => {
      const grade = climb.grade;
      const isCompleted = climb.completed;

      if (!gradeMap[grade]) {
        gradeMap[grade] = { completed: 0, notCompleted: 0 };
      }

      if (isCompleted) {
        gradeMap[grade].completed += 1;
      } else {
        gradeMap[grade].notCompleted += 1;
      }
    });

    const grades = Object.keys(gradeMap).sort();

    const completedAttempts = grades.map((grade) => gradeMap[grade].completed);
    const notCompletedAttempts = grades.map((grade) => gradeMap[grade].notCompleted);

    return {
      labels: grades,
      datasets: [
        {
          label: 'Completed',
          data: completedAttempts,
          backgroundColor: grades.map((grade) => colorMap[grade] || 'rgba(201, 203, 207, 0.6)'),
        },
        {
          label: 'Not Completed',
          data: notCompletedAttempts,
          backgroundColor: grades.map((grade) => fadedColorMap[grade] || 'rgba(201, 203, 207, 0.3)'),
        },
      ],
    };
  }, [data]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Completed vs Not Completed by Grade',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Attempts',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Grade',
        },
      },
    },
  };

  if (!chartData) return <div>Loading...</div>;

  return <Bar data={chartData} options={options} />;
};

export default GradeChart;
