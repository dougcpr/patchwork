import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { colorMap } from "./grade-chart.tsx";
import type { Climb } from "./App.tsx";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DailyClimbStackedChart = ({ data }: { data?: Climb[] }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Get all unique grades and all dates (even if no completed climbs)
  const grades = Array.from(new Set(data.map(d => d.grade))).sort();
  const dates = Array.from(
    new Set(data.map(d => d.created_at.slice(0, 10)))
  ).sort();

  // Initialize grouped object with 0s
  const grouped: Record<string, Record<string, number>> = {};
  dates.forEach(date => {
    grouped[date] = {};
    grades.forEach(grade => {
      grouped[date][grade] = 0;
    });
  });

  // Count completed climbs
  data.forEach(item => {
    if (!item.completed) return;
    const date = item.created_at.slice(0, 10);
    grouped[date][item.grade]++;
  });

  const colors = [colorMap.V0, colorMap.V1, colorMap.V2, colorMap.V3, colorMap.V4, colorMap.V5];

  const datasets = grades.map((grade, idx) => ({
    label: grade,
    data: dates.map(date => grouped[date][grade]), // all grades for all dates exist now
    backgroundColor: colors[idx % colors.length],
  }));

  const chartData = {
    labels: dates,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Completed Climbs by Grade per Day' },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          display: false, // hide date labels if desired
        },
      },
      y: { stacked: true },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DailyClimbStackedChart;
