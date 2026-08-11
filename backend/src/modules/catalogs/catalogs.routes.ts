import { FastifyInstance } from 'fastify';

import * as controller from './catalogs.controller';

export async function catalogsRoutes(
  app: FastifyInstance,
) {
  app.get(
    '/catalogs/sectors',
    controller.getSectors,
  );

  app.get(
    '/catalogs/statuses',
    controller.getStatuses,
  );

  app.get(
    '/catalogs/divergence-types',
    controller.getDivergenceTypes,
  );

  app.get(
    '/catalogs/suppliers',
    controller.getSuppliers,
  );

  app.get(
    '/catalogs/products',
    controller.getProducts,
  );
}
