import path from 'node:path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const projectRoot = process.cwd();

dotenv.config({
  path: path.resolve(projectRoot, '.env.local'),
});

// Fallback para .env se .env.local não existir
dotenv.config();

const app = express();
const port = process.env.RIO_PROXY_PORT ? Number(process.env.RIO_PROXY_PORT) : 3001;
const apiUrl =
  process.env.RIO_API_URL ?? 'https://rio-api-test.onrender.com/v1/chat/completions';
const apiKey = process.env.RIO_API_KEY;

if (!apiKey) {
  console.warn(
    '[proxy] Atenção: defina RIO_API_KEY no arquivo .env.local para que o proxy injete a credencial.'
  );
}

app.use(
  cors({
    origin: process.env.RIO_ALLOWED_ORIGINS?.split(',') ?? true,
  })
);
app.use(express.json({ limit: '50mb' }));

app.post('/api/chat', async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({
      error: 'RIO_API_KEY não está configurada no proxy.',
    });
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('[proxy] Erro ao encaminhar requisição:', error);
    res.status(502).json({
      error: 'Falha ao se comunicar com o serviço Rio API.',
    });
  }
});

app.listen(port, () => {
  console.log(`[proxy] Servidor iniciado em http://localhost:${port}`);
});
