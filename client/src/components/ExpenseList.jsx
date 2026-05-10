// 登録済み支出の一覧表示コンポーネント
export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="card">
        <h2>支出一覧</h2>
        <p className="empty-msg">まだデータがありません。レシートを読み込んでください。</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>支出一覧</h2>
      <div className="expense-list">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            <div className="expense-header">
              <span className="expense-store">{expense.storeName}</span>
              <span className="expense-date">{expense.date}</span>
              <button
                className="btn-delete"
                onClick={() => onDelete(expense.id)}
                title="削除"
              >
                ✕
              </button>
            </div>
            <table className="expense-table">
              <tbody>
                {expense.items?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td><span className="category-badge">{item.category}</span></td>
                    <td className="price">¥{item.price?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}><strong>合計</strong></td>
                  <td className="price"><strong>¥{expense.total?.toLocaleString()}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
