const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./shop.db');

db.serialize(() => {
  // テーブルがなければ作成
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL
  )`);

  // データ確認と挿入
  db.get("SELECT count(*) as count FROM products", (err, row) => {
    if (err) {
      console.error(err);
      db.close(); // エラー時も閉じる
      return;
    }

    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO products (name, price) VALUES (?, ?)");
      stmt.run("Apple", 100);
      stmt.run("Orange", 150);
      stmt.run("Banana", 200);

      // 挿入処理の完了を待ってから閉じる
      stmt.finalize((err) => {
        if (err) console.error(err);
        else console.log("Initial data inserted.");
        db.close();
      });
    } else {
      console.log("Data already exists.");
      db.close(); // データがある場合もここで閉じる
    }
  });
});

// db.close();  <-- ここにあった削除命令を削除（これが早すぎた原因です）
