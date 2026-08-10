import {
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise';

import { pool } from '../../config/database';

import {
  CreateQualityRecordDTO,
  QualityRecord,
  UpdateQualityRecordDTO,
} from './quality.types';

/**
 * Representação do registro retornado pelo MySQL.
 *
 * O mysql2 exige que os registros de SELECT
 * sejam baseados em RowDataPacket.
 */
interface QualityRecordRow extends RowDataPacket, QualityRecord {}

/**
 * Busca todos os registros de qualidade.
 */
export async function findAll(): Promise<QualityRecord[]> {
  const [rows] = await pool.query<QualityRecordRow[]>(
    `
      SELECT
        id,
        sector_id,
        status_id,
        divergence_type_id,
        product_id,
        supplier_id,
        quantity,
        observation,
        correction_action,
        observation_date,
        correction_date,
        responsible,
        created_at,
        updated_at
      FROM quality_records
      ORDER BY id DESC
    `,
  );

  return rows;
}

/**
 * Busca um registro de qualidade pelo ID.
 */
export async function findById(
  id: number,
): Promise<QualityRecord | null> {
  const [rows] = await pool.query<QualityRecordRow[]>(
    `
      SELECT
        id,
        sector_id,
        status_id,
        divergence_type_id,
        product_id,
        supplier_id,
        quantity,
        observation,
        correction_action,
        observation_date,
        correction_date,
        responsible,
        created_at,
        updated_at
      FROM quality_records
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  return rows[0] ?? null;
}

/**
 * Cria um novo registro de qualidade.
 */
export async function create(
  data: CreateQualityRecordDTO,
): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    `
      INSERT INTO quality_records (
        sector_id,
        status_id,
        divergence_type_id,
        product_id,
        supplier_id,
        quantity,
        observation,
        correction_action,
        observation_date,
        correction_date,
        responsible
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.sector_id,
      data.status_id,
      data.divergence_type_id ?? null,
      data.product_id ?? null,
      data.supplier_id ?? null,
      data.quantity ?? 0,
      data.observation ?? null,
      data.correction_action ?? null,
      data.observation_date ?? null,
      data.correction_date ?? null,
      data.responsible ?? null,
    ],
  );

  return result.insertId;
}

/**
 * Atualiza um registro de qualidade.
 *
 * A atualização é feita campo a campo para evitar
 * problemas de tipagem com unknown[] no mysql2.
 */
export async function update(
  id: number,
  data: UpdateQualityRecordDTO,
): Promise<boolean> {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];

  if (data.sector_id !== undefined) {
    fields.push('sector_id = ?');
    values.push(data.sector_id);
  }

  if (data.status_id !== undefined) {
    fields.push('status_id = ?');
    values.push(data.status_id);
  }

  if (data.divergence_type_id !== undefined) {
    fields.push('divergence_type_id = ?');
    values.push(data.divergence_type_id);
  }

  if (data.product_id !== undefined) {
    fields.push('product_id = ?');
    values.push(data.product_id);
  }

  if (data.supplier_id !== undefined) {
    fields.push('supplier_id = ?');
    values.push(data.supplier_id);
  }

  if (data.quantity !== undefined) {
    fields.push('quantity = ?');
    values.push(data.quantity);
  }

  if (data.observation !== undefined) {
    fields.push('observation = ?');
    values.push(data.observation);
  }

  if (data.correction_action !== undefined) {
    fields.push('correction_action = ?');
    values.push(data.correction_action);
  }

  if (data.observation_date !== undefined) {
    fields.push('observation_date = ?');
    values.push(data.observation_date);
  }

  if (data.correction_date !== undefined) {
    fields.push('correction_date = ?');
    values.push(data.correction_date);
  }

  if (data.responsible !== undefined) {
    fields.push('responsible = ?');
    values.push(data.responsible);
  }

  /**
   * Nenhum campo para atualizar.
   */
  if (fields.length === 0) {
    return false;
  }

  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `
      UPDATE quality_records
      SET ${fields.join(', ')}
      WHERE id = ?
    `,
    values,
  );

  return result.affectedRows > 0;
}

/**
 * Remove um registro de qualidade.
 */
export async function remove(
  id: number,
): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `
      DELETE FROM quality_records
      WHERE id = ?
    `,
    [id],
  );

  return result.affectedRows > 0;
}