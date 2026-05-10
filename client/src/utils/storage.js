const STORAGE_KEY = 'kakeibo_expenses';

// ローカルストレージから支出データを読み込む
export function loadExpenses() {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

// ローカルストレージに支出データを保存する
export function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}
