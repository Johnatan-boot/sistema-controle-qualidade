import fs from 'fs/promises';
import path from 'path';
import { pool } from '../config/database';
import { RowDataPacket } from 'mysql2/promise';

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

    // Apenas leia o arquivo de seed (que agora está limpo)
    const seedPath = path.resolve(process.cwd(), 'src', 'database', 'seed.sql');
    const seedSql = await fs.readFile(seedPath, 'utf8');

    // Executa o seed. Se for grande demais, o ideal é dividir, 
    // mas vamos tentar rodar direto sem o USE/START TRANSACTION
    await connection.query(seedSql);
    
    console.log('🚀 Banco populado!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    connection.release();
  }
}