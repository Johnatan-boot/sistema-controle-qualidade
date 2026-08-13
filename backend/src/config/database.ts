import mysql, {
  Pool,
  PoolConnection,
  RowDataPacket,
} from 'mysql2/promise';

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não configurada: ${name}`);
  }

  return value;
}

const DB_HOST = getRequiredEnv('DB_HOST');
const DB_USER = getRequiredEnv('DB_USER');
const DB_PASSWORD = getRequiredEnv('DB_PASSWORD');
const DB_NAME = getRequiredEnv('DB_NAME');
const DB_PORT = Number(process.env.DB_PORT ?? 3306);

if (Number.isNaN(DB_PORT)) {
  throw new Error('DB_PORT precisa ser um número válido.');
}

const pool: Pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0,

  charset: 'utf8mb4',
});

export async function getConnection(): Promise<PoolConnection> {
  return pool.getConnection();
}

interface CountResult extends RowDataPacket {
  total: number;
}

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

/**
 * O Render faz deploy sem downtime: a instância NOVA sobe antes da ANTIGA
 * ser desligada. Durante essa janela (poucos segundos) as duas ficam de pé
 * ao mesmo tempo, e a soma das conexões de ambas pode passar do limite de
 * 5 conexões simultâneas do Clever Cloud (free tier), derrubando o boot
 * com ER_USER_LIMIT_REACHED. Como a instância antiga desliga sozinha em
 * poucos segundos, tentamos de novo algumas vezes com espera crescente
 * antes de desistir.
 */
async function withConnectionLimitRetry<T>(
  fn: () => Promise<T>,
  { attempts = 5, baseDelayMs = 2000 } = {}
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isConnectionLimitError(error) || attempt === attempts) {
        throw error;
      }

      const delay = baseDelayMs * attempt;
      console.warn(
        `⚠️ Limite de conexões do MySQL atingido (tentativa ${attempt}/${attempts}). ` +
          `Provavelmente a instância antiga do deploy ainda está de pé. ` +
          `Tentando de novo em ${delay}ms...`
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

export async function testDatabaseConnection(): Promise<{
  database: string;
  host: string;
  port: number;
  qualityRecords: number;
}> {
  return withConnectionLimitRetry(async () => {
    let connection: PoolConnection | undefined;

    try {
      connection = await pool.getConnection();

      await connection.ping();

      const [rows] = await connection.query<CountResult[]>(
        'SELECT COUNT(*) AS total FROM quality_records'
      );

      const qualityRecords = Number(rows[0]?.total ?? 0);

      return {
        database: DB_NAME,
        host: DB_HOST,
        port: DB_PORT,
        qualityRecords,
      };
    } catch (error) {
      console.error('❌ Erro ao conectar ao MySQL:', error);
      throw error;
    } finally {
      connection?.release();
    }
  });
}

export async function closeDatabase(): Promise<void> {
  await pool.end();

  console.log('🔌 Pool MySQL encerrado.');
}

export { pool };