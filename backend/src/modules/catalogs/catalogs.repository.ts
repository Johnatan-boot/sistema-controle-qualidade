import { RowDataPacket } from 'mysql2/promise';

import { pool } from '../../config/database';

import {
  CatalogItem,
  ProductCatalogItem,
} from './catalogs.types';

interface CatalogRow extends RowDataPacket, CatalogItem {}

interface ProductCatalogRow
  extends RowDataPacket,
    ProductCatalogItem {}

export async function findSectors(): Promise<CatalogItem[]> {
  const [rows] = await pool.query<CatalogRow[]>(
    `
      SELECT
        id,
        name
      FROM sectors
      WHERE active = TRUE
      ORDER BY name ASC
    `,
  );

  return rows;
}

export async function findStatuses(): Promise<CatalogItem[]> {
  const [rows] = await pool.query<CatalogRow[]>(
    `
      SELECT
        id,
        name
      FROM statuses
      WHERE active = TRUE
      ORDER BY name ASC
    `,
  );

  return rows;
}

export async function findDivergenceTypes(): Promise<CatalogItem[]> {
  const [rows] = await pool.query<CatalogRow[]>(
    `
      SELECT
        id,
        name
      FROM divergence_types
      WHERE active = TRUE
      ORDER BY code ASC
    `,
  );

  return rows;
}

export async function findSuppliers(): Promise<CatalogItem[]> {
  const [rows] = await pool.query<CatalogRow[]>(
    `
      SELECT
        id,
        name
      FROM suppliers
      WHERE active = TRUE
      ORDER BY name ASC
    `,
  );

  return rows;
}

export async function findProducts(): Promise<ProductCatalogItem[]> {
  const [rows] = await pool.query<ProductCatalogRow[]>(
    `
      SELECT
        id,
        sku,
        description,
        supplier_id
      FROM products
      WHERE active = TRUE
      ORDER BY description ASC
    `,
  );

  return rows;
}
