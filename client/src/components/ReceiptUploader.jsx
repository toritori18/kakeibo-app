import { useState, useRef } from 'react';

// レシート画像アップロード＆解析コンポーネント
export default function ReceiptUploader({ onAdd }) {
  const [preview, setPreview] = useState(null);      // 画像プレビューURL
  const [file, setFile] = useState(null);            // 選択ファイル
  const [loading, setLoading] = useState(false);     // 解析中フラグ
  const [error, setError] = useState('');            // エラーメッセージ
  const [result, setResult] = useState(null);        // 解析結果（確認用）
  const inputRef = useRef(null);

  // ファイル選択時: プレビュー表示
  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setError('');
    setResult(null);
    setPreview(URL.createObjectURL(selected));
  }

  // ドラッグ＆ドロップ対応
  function handleDrop(e) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;
    setFile(dropped);
    setError('');
    setResult(null);
    setPreview(URL.createObjectURL(dropped));
  }

  // バックエンドへ送信してClaude APIで解析
  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const res = await fetch('/api/analyze-receipt', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || '解析に失敗しました');
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 確認後に家計簿へ登録
  function handleSave() {
    if (!result) return;
    onAdd(result);
    // フォームをリセット
    setFile(null);
    setPreview(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleReset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="card uploader">
      <h2>レシートを読み込む</h2>

      {/* ドロップゾーン */}
      {!result && (
        <div
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="レシートプレビュー" className="preview-img" />
          ) : (
            <p>クリックまたはドラッグ＆ドロップで画像を選択</p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}

      {/* 解析ボタン */}
      {file && !result && (
        <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
          {loading ? '解析中...' : 'レシートを解析する'}
        </button>
      )}

      {/* 解析結果の確認 */}
      {result && (
        <div className="result-preview">
          <h3>解析結果の確認</h3>
          <table className="result-table">
            <thead>
              <tr>
                <th>商品名</th>
                <th>カテゴリ</th>
                <th>金額</th>
              </tr>
            </thead>
            <tbody>
              {result.items?.map((item, i) => (
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
                <td className="price"><strong>¥{result.total?.toLocaleString()}</strong></td>
              </tr>
            </tfoot>
          </table>
          <p className="receipt-meta">
            日付: {result.date} ／ 店舗: {result.storeName}
          </p>
          <div className="btn-row">
            <button className="btn-primary" onClick={handleSave}>家計簿に登録する</button>
            <button className="btn-secondary" onClick={handleReset}>やり直す</button>
          </div>
        </div>
      )}
    </div>
  );
}
