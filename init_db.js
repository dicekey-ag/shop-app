const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  // 既存のテーブルがあれば削除して作り直す（リセット）
  db.run("DROP TABLE IF EXISTS items");
  db.run("DROP TABLE IF EXISTS orders");

  // 商品テーブル作成
  db.run(`CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price INTEGER,
    image_url TEXT
  )`);

  // 注文テーブル作成
  db.run(`CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER,
    quantity INTEGER,
    customer_name TEXT,
    customer_address TEXT,
    delivery_time TEXT
  )`);

  // データ投入（ガジェットショップ用データ）
  const stmt = db.prepare("INSERT INTO items (name, description, price, image_url) VALUES (?, ?, ?, ?)");

  stmt.run(
    "高耐久 USB-C ケーブル (1.5m)",
    "断線に強いナイロン編み込みケーブル。急速充電対応。",
    1200,
    "/images/cable.jpg" // 画像ファイルがない場合は仮のパスでOK
  );

  stmt.run(
    "ワイヤレス・ノイズキャンセリングイヤホン",
    "業界最高クラスのノイズキャンセリング性能。没入感をあなたに。",
    12000,
    "/images/earphone.jpg"
  );

  stmt.run(
    "メカニカルキーボード (赤軸)",
    "打鍵感にこだわったプログラマー向けキーボード。LEDバックライト搭載。",
    15800,
    "/images/keyboard.jpg"
  );

  stmt.finalize();

  console.log("データベースの初期化が完了しました（ガジェットショップ仕様）");
});

db.close();
