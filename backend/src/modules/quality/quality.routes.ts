import { FastifyInstance } from 'fastify';
import * as controller from './quality.controller';
import { qualitySchema } from './quality.schema';

export async function qualityRoutes(
  app: FastifyInstance
) {
  app.get(
    '/quality',
    controller.getAll
  );

  app.get(
    '/quality/:id',
    {
      schema: qualitySchema,
    },
    controller.getById
  );

  app.post(
    '/quality',
    controller.create
  );

  app.put(
    '/quality/:id',
    {
      schema: qualitySchema,
    },
    controller.update
  );

  app.delete(
    '/quality/:id',
    {
      schema: qualitySchema,
    },
    controller.remove
  );
}
