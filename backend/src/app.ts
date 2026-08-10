import Fastify, { FastifyInstance } from 'fastify';

// ROTAS
import { qualityRoutes } from './modules/quality/quality.routes';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true,
  });

  // Health Check
  app.get('/health', async () => {
    return {
      status: 'ok',
      message: 'Backend Controle de Qualidade funcionando!',
    };
  });

  // Rotas de Qualidade
  app.register(qualityRoutes, {
    prefix: '/api',
  });

  return app;
}

export default buildApp();