import fs from 'fs/promises';
import path from 'path';
import mysql, { RowDataPacket } from 'mysql2/promise';

interface CountResult extends RowDataPacket {
  total: number;
}

// Ordem de execução importa: catalogos -> products -> quality_records -> verificacao
const SEED_FILES = [
  '01_catalogos.sql',
  '02_products.sql',
  '03_quality_records.sql',
  '04_verificacao.sql',
];

// Contagens esperadas depois de um seed completo e bem-sucedido.
const EXPECTED_PRODUCTS = 17118;
const EXPECTED_QUALITY_RECORDS = 42;

const TABLES_TO_RESET = [
  'quality_records',
  'products',
  'suppliers',
  'divergence_types',
  'statuses',
  'sectors',
] as const;

function isConnectionLimitError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'ER_USER_LIMIT_REACHED'
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createSeedConnection(config: {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}): Promise<mysql.Connection> {
  const attempts = 5;
  const baseDelayMs = 2000;
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await mysql.createConnection({
        ...config,
        multipleStatements: true,
        charset: 'utf8mb4',
      });
    } catch (error) {
      lastError = error;

      if (!isConnectionLimitError(error) || attempt === attempts) {
        throw error;
      }

      const delay = baseDelayMs * attempt;
      console.warn(
        `⚠️ Limite de conexões do MySQL atingido ao abrir conexão do seed ` +
          `(tentativa ${attempt}/${attempts}). Tentando de novo em ${delay}ms...`
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

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

  const seedConnection = await createSeedConnection({
    host,
    port,
    user,
    password,
    database,
  });

  try {
    const isComplete = await checkSeedComplete(seedConnection);

    if (isComplete) {
      console.log('🟢 Banco já populado corretamente. Seed ignorado.');
      return;
    }

    console.log('⚠️ Banco vazio ou incompleto detectado. Limpando e repopulando do zero...');
    await resetTables(seedConnection);
    await runSeedFiles(seedConnection);

    console.log('🚀 Banco populado com sucesso automaticamente!');
  } catch (error) {
    console.error('❌ Erro durante o auto-seed:', error);
    throw error;
  } finally {
    await seedConnection.end();
  }
}

async function checkSeedComplete(
  connection: mysql.Connection
): Promise<boolean> {
  const [productRows] = await connection.query<CountResult[]>(
    `SELECT COUNT(*) AS total FROM products`
  );
  const totalProducts = Number(productRows[0]?.total ?? 0);

  const [recordRows] = await connection.query<CountResult[]>(
    `SELECT COUNT(*) AS total FROM quality_records`
  );
  const totalRecords = Number(recordRows[0]?.total ?? 0);

  console.log(
    `   Produtos encontrados: ${totalProducts} (esperado: ${EXPECTED_PRODUCTS})`
  );
  console.log(
    `   Registros de qualidade encontrados: ${totalRecords} (esperado: ${EXPECTED_QUALITY_RECORDS})`
  );

  return (
    totalProducts === EXPECTED_PRODUCTS &&
    totalRecords === EXPECTED_QUALITY_RECORDS
  );
}

async function resetTables(connection: mysql.Connection): Promise<void> {
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');

  for (const table of TABLES_TO_RESET) {
    await connection.query(`TRUNCATE TABLE ${table}`);
    console.log(`   🗑️  ${table} limpa`);
  }

  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function runSeedFiles(connection: mysql.Connection): Promise<void> {
  const seedDir = path.resolve(
    process.cwd(),
    'src',
    'database',
    'migrations',
    'seeds'
  );

  for (const fileName of SEED_FILES) {
    const filePath = path.join(seedDir, fileName);
    const sql = await fs.readFile(filePath, 'utf8');
    console.log(`   -> executando ${fileName} ...`);
    await connection.query(sql);
    console.log(`   ✅ ${fileName} concluído`);
  }
}