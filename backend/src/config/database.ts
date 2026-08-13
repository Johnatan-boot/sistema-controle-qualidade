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
  connectionLimit: 4,
  queueLimit: 0,

  charset: 'utf8mb4',
});

export async function getConnection(): Promise<PoolConnection> {
  return pool.getConnection();
}

interface CountResult extends RowDataPacket {
  total: number;
}

export async function testDatabaseConnection(): Promise<{
  database: string;
  host: string;
  port: number;
  qualityRecords: number;
}> {
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
}

export async function closeDatabase(): Promise<void> {
  await pool.end();

  console.log('🔌 Pool MySQL encerrado.');
}

export { pool };