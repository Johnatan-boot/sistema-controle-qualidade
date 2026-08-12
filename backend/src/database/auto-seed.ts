import fs from 'fs/promises';
import path from 'path';
import mysql, { RowDataPacket } from 'mysql2/promise';

interface ProductCountResult extends RowDataPacket {
  total: number;
}

// Ordem de execução importa: catalogos -> products -> quality_records -> verificacao
const SEED_FILES = [
  '01_catalogos.sql',
  '02_products.sql',
  '03_quality_records.sql',
  '04_verificacao.sql',
];

/**
 * Executa os arquivos de seed (já organizados em 01/02/03/04) na ordem certa.
 * Cada arquivo é enviado inteiro ao MySQL numa conexão com
 * `multipleStatements: true`, então comentários (--) e múltiplos comandos
 * dentro do mesmo arquivo são tratados corretamente pelo próprio driver
 * (nada de split manual por ';').
 */
export async function runAutoSeedIfNeeded(): Promise<void> {
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

  const seedConnection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  try {
    const [rows] = await seedConnection.query<ProductCountResult[]>(
      `SELECT COUNT(*) AS total FROM products`
    );
    const totalProducts = Number(rows[0]?.total ?? 0);

    if (totalProducts > 0) {
      console.log(`🟢 Banco já populado (${totalProducts} produtos encontrados). Seed ignorado.`);
      return;
    }

    console.log('⚠️ Banco vazio detectado! Iniciando população automática dos dados...');

    // Pasta onde os 4 arquivos .sql realmente estão no repositório
    const seedDir = path.resolve(process.cwd(), 'src', 'database', 'migrations', 'seeds');

    for (const fileName of SEED_FILES) {
      const filePath = path.join(seedDir, fileName);
      const sql = await fs.readFile(filePath, 'utf8');
      console.log(`   -> executando ${fileName} ...`);
      await seedConnection.query(sql);
      console.log(`   ✅ ${fileName} concluído`);
    }

    console.log('🚀 Banco populado com sucesso automaticamente!');
  } catch (error) {
    console.error('❌ Erro durante o auto-seed:', error);
    throw error;
  } finally {
    await seedConnection.end();
  }
}