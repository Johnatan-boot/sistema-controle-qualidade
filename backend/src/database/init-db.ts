import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import mysql from 'mysql2/promise';

dotenv.config();

async function main(): Promise<void> {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host || !user || !password || !database) {
    throw new Error(
      'Variáveis DB_HOST, DB_USER, DB_PASSWORD e DB_NAME são obrigatórias.'
    );
  }

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
  });

  console.log(`🔌 Conectado ao banco: ${database}`);

  const sql = await fs.readFile('./database/schema-deploy.sql', 'utf8');

  await connection.query(sql);

  console.log('✅ Schema criado com sucesso.');

  await connection.end();
}

main().catch((error) => {
  console.error('❌ Erro ao inicializar banco:', error);
  process.exit(1);
});