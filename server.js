const fastify = require('fastify')({ logger: true });

// ルートパス (http://localhost:3000/) へのアクセスに対する処理
fastify.get('/', async (request, reply) => {
  return { message: 'ショップへようこそ!' };
});

// サーバーを起動する処理
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
