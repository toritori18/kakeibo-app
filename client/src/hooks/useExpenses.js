import { useState, useEffect } from 'react';
import { loadExpenses, saveExpenses } from '../utils/storage';

// 支出データの管理フック（ローカルストレージと同期）
export function useExpenses() {
  const [expenses, setExpenses] = useState(() => loadExpenses());

  // expenses が変わるたびにローカルストレージへ保存
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  // レシートの解析結果を1件追加
  function addExpense(receiptData) {
    const newExpense = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...receiptData,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }

  // 指定IDの支出を削除
  function deleteExpense(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  // 全データをクリア
  function clearExpenses() {
    setExpenses([]);
  }

  return { expenses, addExpense, deleteExpense, clearExpenses };
}
