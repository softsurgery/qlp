import { registerAs } from '@nestjs/config';

export default registerAs('livekit', () => ({
  url: process.env.LIVEKIT_URL ?? 'ws://localhost:7880',
  apiUrl: process.env.LIVEKIT_API_URL ?? 'http://localhost:7880',
  apiKey: process.env.LIVEKIT_API_KEY,
  apiSecret: process.env.LIVEKIT_API_SECRET,
  tokenTtl: process.env.LIVEKIT_TOKEN_TTL ? Number(process.env.LIVEKIT_TOKEN_TTL) : 3600,
  emptyTimeout: process.env.LIVEKIT_EMPTY_TIMEOUT
    ? Number(process.env.LIVEKIT_EMPTY_TIMEOUT)
    : 300,
  webhookApiKey: process.env.LIVEKIT_WEBHOOK_API_KEY || process.env.LIVEKIT_API_KEY,
  webhookApiSecret: process.env.LIVEKIT_WEBHOOK_API_SECRET || process.env.LIVEKIT_API_SECRET,
}));
