import fs from 'fs/promises';
import path from 'path';
import { pool } from '../config/database';
import { RowDataPacket } from 'mysql2';

interface ProductCountResult extends RowDataPacket {
  total: number;
}

export async function runAutoSeedIfNeeded(): Promise<void> {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query<ProductCountResult[]>(
      `SELECT COUNT(*) AS total FROM products`
    );

    if (Number(rows[0]?.total ?? 0) > 0) return;

    console.log('⚠️ Banco vazio! Populando...');

    const seedPath = path.resolve(process.cwd(), 'src', 'database', 'seed.sql');
    const seedSql = await fs.readFile(seedPath, 'utf8');

    // Divide o script SQL em comandos individuais separados por ponto-e-vírgula,
    // ignorando comentários e linhas em branco.
    const queries = seedSql
      .split(';')
      .map((q) => q.trim())
      .filter((q) => q.length > 0 && !q.startsWith('--'));

    for (const query of queries) {
      await connection.query(query);
    }
    
    console.log('🚀 Banco populado com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    connection.release();
  }
}