import 'dotenv/config';
import app from './app';
import { testDatabaseConnection } from './config/database';
import { runAutoSeedIfNeeded } from './database/auto-seed'; // <-- Importe aqui

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    const database = await testDatabaseConnection();

    console.log('✅ MySQL conectado com sucesso!');
    console.log(`📦 Banco: ${database.database}`);
    console.log(`🖥️ Host: ${database.host}`);
    console.log(`🔌 Porta: ${database.port}`);
    console.log(`📋 Registros de qualidade: ${database.qualityRecords}`);

    // 👉 Executa o seed automático caso o banco esteja vazio
    await runAutoSeedIfNeeded();

    await app.listen({
      port: PORT,
      host: '0.0.0.0',
    });

    console.log('🚀 Backend iniciado com sucesso!');
    console.log(`🌐 API disponível na porta ${PORT}`);
  } catch (error) {
    console.error('❌ Falha ao iniciar o backend:');

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

startServer();