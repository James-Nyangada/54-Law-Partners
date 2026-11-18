import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env, isProduction } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';
import { generalLimiter } from './middleware/rateLimit.js';

export function createApp() {
  const app = express();

  // Behind a proxy on most hosts; needed for rate limiting and secure cookies.
  app.set('trust proxy', 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  app.use(
    cors({
      origin(origin, callback) {
        // Server-to-server calls and curl have no Origin header.
        if (!origin) return callback(null, true);
        if (env.corsOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`Origin not allowed: ${origin}`));
      },
      credentials: true, // the refresh cookie needs this
    })
  );

  app.use(morgan(isProduction ? 'combined' : 'dev'));
  app.use('/api', generalLimiter);

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
