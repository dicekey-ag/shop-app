const fastify = require('fastify')({ logger: true });
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// データベースへの接続
const dbPath = path.resolve(__dirname, 'shop.db');
const db = new sqlite3.Database(dbPath);

// ルートパス: 動作確認用
fastify.get('/', async (request, reply) => {
  return { message: 'Welcome to the Shop API!' };
});

// 商品一覧を取得するAPI (/products)
fastify.get('/products', (request, reply) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM products", (err, rows) => {
      if (err) {
        fastify.log.error(err);
        reply.code(500).send({ error: 'Database error' });
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// サーバー起動
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
