const fastify = require('fastify')({ logger: true });
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// EJSテンプレートエンジンの設定
fastify.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs'),
  },
  root: path.join(__dirname, 'views'),
});

// 静的ファイル（CSSや画像）の配信設定
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

// フォームデータを解析するための設定
fastify.register(require('@fastify/formbody'));

// --- ルーティング ---

// 1. 商品一覧ページ（トップページ）
fastify.get('/', (request, reply) => {
  db.all("SELECT * FROM items", (err, rows) => {
    if (err) {
      reply.code(500).send('Database error');
      return;
    }
    // ガジェットショップ「TechMart」としてレンダリング
    reply.view('index.ejs', { items: rows });
  });
});

// 2. 注文確認ページ（カートに入れた後の画面）
fastify.post('/confirm', (request, reply) => {
  const { item_id, quantity } = request.body;

  db.get("SELECT * FROM items WHERE id = ?", [item_id], (err, item) => {
    if (err || !item) {
      reply.code(404).send('Item not found');
      return;
    }

    const qty = parseInt(quantity, 10) || 1;
    const total = item.price * qty;

    reply.view('order.ejs', { item, quantity: qty, total });
  });
});

// 3. 注文完了処理
fastify.post('/order', (request, reply) => {
  const { item_id, quantity, customer_name, customer_address, delivery_time } = request.body;

  const stmt = db.prepare("INSERT INTO orders (item_id, quantity, customer_name, customer_address, delivery_time) VALUES (?, ?, ?, ?, ?)");
  stmt.run(item_id, quantity, customer_name, customer_address, delivery_time, function (err) {
    if (err) {
      fastify.log.error(err);
      reply.code(500).send('Order failed');
      return;
    }
    // 注文完了画面へ
    reply.view('complete.ejs', { orderId: this.lastID });
  });
});

// サーバー起動
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('TechMart Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
