const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config({ path: '../../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// multer: メモリにアップロードファイルを一時保存（ディスク不使用）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 最大10MB
});

// Claude クライアントの初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// レシート解析エンドポイント
app.post('/api/analyze-receipt', upload.single('receipt'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'レシート画像が添付されていません' });
  }

  // アップロード画像をbase64に変換
  const base64Image = req.file.buffer.toString('base64');
  const mediaType = req.file.mimetype;

  // 対応メディアタイプの確認
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(mediaType)) {
    return res.status(400).json({ error: 'JPEG・PNG・GIF・WebP 形式の画像のみ対応しています' });
  }

  try {
    // Claude API を呼び出してレシートを解析
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `このレシート画像を分析して、以下のJSONフォーマットで情報を抽出してください。

{
  "date": "YYYY-MM-DD形式の日付（不明な場合は今日の日付）",
  "storeName": "店舗名（不明な場合は「不明」）",
  "items": [
    {
      "name": "商品名",
      "price": 金額（税込、数値のみ）,
      "category": "カテゴリ名"
    }
  ],
  "total": 合計金額（税込、数値のみ）
}

カテゴリは必ず以下のいずれかを選択してください：
- 食費（スーパー・コンビニ・食料品）
- 外食（レストラン・カフェ・ファストフード・テイクアウト）
- 日用品（洗剤・消耗品・生活雑貨・ティッシュ等）
- 医療費（薬局・ドラッグストア・病院）
- 交通費（電車・バス・タクシー・ガソリン・駐車場）
- 衣類（衣服・靴・アクセサリー・バッグ）
- 娯楽（本・DVD・ゲーム・映画・趣味）
- その他（上記に当てはまらないもの）

JSONのみを返してください。説明文・コードブロック・余計な文字は不要です。`,
            },
          ],
        },
      ],
    });

    // レスポンスからJSONを抽出してパース
    const rawText = response.content[0].text.trim();
    // コードブロックが含まれていた場合も対応
    const jsonText = rawText.replace(/^```json?\n?/, '').replace(/\n?```$/, '');

    let receiptData;
    try {
      receiptData = JSON.parse(jsonText);
    } catch {
      return res.status(500).json({ error: 'レシートの解析結果をJSONに変換できませんでした' });
    }

    res.json(receiptData);
  } catch (error) {
    console.error('Claude API エラー:', error);
    res.status(500).json({ error: 'レシートの解析中にエラーが発生しました' });
  }
});

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
