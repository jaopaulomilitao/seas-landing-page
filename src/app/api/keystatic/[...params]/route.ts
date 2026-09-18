// src/app/api/keystatic/[...params]/route.ts
import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config';

// são geradas as rotas de api para leitura e gravação local
export const { GET, POST } = makeRouteHandler({ config });