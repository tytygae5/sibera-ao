import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import { createApiRouter } from '../../backend/apiRouter.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// Mount router on /api and root to handle any Netlify function path prefixing
app.use('/api', createApiRouter());
app.use(createApiRouter());

export const handler = serverless(app);
