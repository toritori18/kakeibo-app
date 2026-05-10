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

// Chart.js の必要モジュールを登録
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 月別支出棒グラフコンポーネント
export default function MonthlyChart({ expenses }) {
  // 月別合計を集計（キー: 'YYYY-MM'）
  const monthly = {};
  expenses.forEach((expense) => {
    const month = expense.date?.slice(0, 7); // 'YYYY-MM'
    if (!month) return;
    monthly[month] = (monthly[month] || 0) + (expense.total || 0);
  });

  // 月順にソート
  const labels = Object.keys(monthly).sort();
  const values = labels.map((m) => monthly[m]);

  if (labels.length === 0) {
    return (
      <div className="card chart-card">
        <h2>月別支出</h2>
        <p className="empty-msg">データがありません</p>
      </div>
    );
  }

  const data = {
    labels: labels.map((m) => {
      const [y, mo] = m.split('-');
      return `${y}年${parseInt(mo)}月`;
    }),
    datasets: [
      {
        label: '支出合計 (円)',
        data: values,
        backgroundColor: '#36A2EB',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ¥${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Y軸の目盛りを円表示
          callback: (v) => `¥${v.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="card chart-card">
      <h2>月別支出</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
