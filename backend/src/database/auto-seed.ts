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
    // Verifica se a tabela products existe e quantos registros tem
    const [rows] = await connection.query<ProductCountResult[]>(
      `SELECT COUNT(*) AS total FROM products`
    );

    const totalProducts = Number(rows[0]?.total ?? 0);

    if (totalProducts > 0) {
      console.log(`🟢 Banco já populado (${totalProducts} produtos encontrados). Seed ignorado.`);
      return;
    }

    console.log('⚠️ Banco vazio detectado! Iniciando população automática dos dados...');

    // Caminho para o seu arquivo SQL de seed ou schema
    const schemaPath = path.resolve(process.cwd(), 'database', 'schema.sql');
    const seedPath = path.resolve(process.cwd(), 'database', 'seed.sql');

    // Executa o schema primeiro (se necessário) e depois o seed
    try {
      const schemaSql = await fs.readFile(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✅ Schema aplicado com sucesso.');
    } catch (e) {
      console.log('ℹ️ Schema já aplicado ou ignorado.');
    }

    const seedSql = await fs.readFile(seedPath, 'utf8');
    await connection.query(seedSql);
    
    console.log('🚀 Banco populado com sucesso automaticamente!');
  } catch (error) {
    console.error('❌ Erro durante o auto-seed:', error);
    // Não quebramos o app caso dê erro de permissão, mas logamos
  } finally {
    connection.release();
  }
}