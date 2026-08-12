import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

// ROTAS
import { qualityRoutes } from './modules/quality/quality.routes';
import { catalogsRoutes } from './modules/catalogs/catalogs.routes';
import { adminRoutes } from './modules/admin/admin.routes';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true,
  });

  // CORS - permite o frontend chamar a API
  // Defina CORS_ORIGIN no Render como a URL exata do frontend
  // (ex: https://sistema-controle-qualidade-frontend.onrender.com)
  // Pode listar mais de uma origem separada por vírgula.
  const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.register(cors, {
    origin: (origin, cb) => {
      // requisições sem origin (ex: curl, health check) sempre passam
      if (!origin) return cb(null, true);

      // fallback: aceita qualquer subdomínio *.onrender.com se nada foi configurado,
      // pra não travar o deploy enquanto a env var não estiver setada
      if (allowedOrigins.length === 0) {
        return cb(null, /\.onrender\.com$/.test(new URL(origin).hostname));
      }

      return cb(null, allowedOrigins.includes(origin));
    },
    credentials: true,
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

  // Catálogos
  app.register(catalogsRoutes, {
    prefix: '/api',
  });
  
  app.register(adminRoutes, {
  prefix: '/api',
});

  return app;
}

export default buildApp();