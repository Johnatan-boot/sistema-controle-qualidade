import { FastifyInstance } from 'fastify';
import { pool } from '../../config/database';

export async function adminRoutes(app: FastifyInstance) {
  app.get('/admin/database-schema', async (_request, reply) => {
    try {
      const [tables] = await pool.query(`
        SELECT TABLE_NAME
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
        ORDER BY TABLE_NAME
      `);

      const tableNames = [
        'sectors',
        'statuses',
        'divergence_types',
        'suppliers',
        'products',
        'quality_records',
      ];

      const schema: Record<string, unknown> = {};

      for (const table of tableNames) {
        const [columns] = await pool.query(
          `
          SELECT
            COLUMN_NAME,
            COLUMN_TYPE,
            IS_NULLABLE,
            COLUMN_DEFAULT,
            EXTRA
          FROM information_schema.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = ?
          ORDER BY ORDINAL_POSITION
          `,
          [table],
        );

        schema[table] = columns;
      }

      return reply.send({
        success: true,
        database: process.env.DB_NAME,
        tables,
        schema,
      });
    } catch (error) {
      app.log.error(error);

      return reply.status(500).send({
        success: false,
        message: 'Erro ao consultar schema do banco.',
      });
    }
  });
}