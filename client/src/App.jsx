import { useExpenses } from './hooks/useExpenses';
import ReceiptUploader from './components/ReceiptUploader';
import ExpenseList from './components/ExpenseList';
import CategoryChart from './components/CategoryChart';
import MonthlyChart from './components/MonthlyChart';

// アプリのルートコンポーネント
export default function App() {
  const { expenses, addExpense, deleteExpense, clearExpenses } = useExpenses();

  // 全支出の合計金額
  const totalAmount = expenses.reduce((sum, e) => sum + (e.total || 0), 0);

  return (
    <div className="app">
      {/* ヘッダー */}
      <header className="app-header">
        <h1>レシート家計簿</h1>
        <span className="total-badge">
          累計: ¥{totalAmount.toLocaleString()}
        </span>
      </header>

      <main className="app-main">
        {/* レシートアップロードエリア */}
        <section className="section-upload">
          <ReceiptUploader onAdd={addExpense} />
        </section>

        {/* グラフエリア（データがある場合のみ表示） */}
        {expenses.length > 0 && (
          <section className="section-charts">
            <CategoryChart expenses={expenses} />
            <MonthlyChart expenses={expenses} />
          </section>
        )}

        {/* 支出一覧 */}
        <section className="section-list">
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          {expenses.length > 0 && (
            <button
              className="btn-clear"
              onClick={() => {
                if (window.confirm('すべてのデータを削除しますか？')) clearExpenses();
              }}
            >
              全データをクリア
            </button>
          )}
        </section>
      </main>
    </div>
  );
}
