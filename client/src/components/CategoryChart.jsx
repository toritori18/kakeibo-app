import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Chart.js の必要モジュールを登録
ChartJS.register(ArcElement, Tooltip, Legend);

// カテゴリ別の色定義
const CATEGORY_COLORS = {
  '食費':   '#FF6384',
  '外食':   '#FF9F40',
  '日用品': '#FFCD56',
  '医療費': '#4BC0C0',
  '交通費': '#36A2EB',
  '衣類':   '#9966FF',
  '娯楽':   '#C9CBCF',
  'その他': '#7EC8A4',
};

// カテゴリ別円グラフコンポーネント
export default function CategoryChart({ expenses }) {
  // 全支出からカテゴリ別集計を作成
  const totals = {};
  expenses.forEach((expense) => {
    expense.items?.forEach((item) => {
      const cat = item.category || 'その他';
      totals[cat] = (totals[cat] || 0) + (item.price || 0);
    });
  });

  const labels = Object.keys(totals);
  const values = Object.values(totals);

  if (labels.length === 0) {
    return (
      <div className="card chart-card">
        <h2>カテゴリ別支出</h2>
        <p className="empty-msg">データがありません</p>
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((l) => CATEGORY_COLORS[l] || '#999'),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          // 金額を円表示
          label: (ctx) => ` ¥${ctx.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="card chart-card">
      <h2>カテゴリ別支出</h2>
      <Pie data={data} options={options} />
    </div>
  );
}
