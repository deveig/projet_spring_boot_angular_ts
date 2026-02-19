import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import https from 'node:https';
import fs from 'node:fs';
import { join } from 'node:path';
// import fetch from 'node-fetch';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Rest API endpoints
 *
 */
app.use('/recipe', express.raw({ type: '*/*', limit: '10mb' }));
app.use('/recipe', async (req, res) => {
  try {
    const response = await fetch('https://nginx-back/recipe', {
      method: req.method,
      headers: { ...req.headers } as HeadersInit,
      // , 'Access-Control-Allow-Origin': 'https://localhost:8087', 'Access-Control-Allow-Credentials': 'true' } as any,
      body: req.method === 'GET' ? undefined : req.body,
    });
    res.status(response.status).json(await response.json());
  } catch (error) {
    // res.status(500).json({ error: 'Failed to fetch recipe' });
    res.status(500).json((error as Error));
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  // const port = process.env['PORT'] || 4000;
  const port = 443;
  https
    .createServer(
      {
        key: fs.readFileSync('/etc/ssl/private/app.key'),
        cert: fs.readFileSync('/etc/ssl/certs/app.crt'),
      },
      app,
    )
    .listen(port, () => {
      // app.listen(port, (error) => {
      //   if (error) {
      //     throw error;
      //   }
      console.log(`Node Express server listening on https://localhost:${port}`);
    });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
