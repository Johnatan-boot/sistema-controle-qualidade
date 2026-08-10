import mysql, {
  Pool,
  PoolConnection,
  RowDataPacket,
} from 'mysql2/promise';

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'qualidade_db',

  waitForConnections: true,
  connectionLimit: 10,
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
      database: process.env.DB_NAME ?? 'qualidade_db',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 3306),
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