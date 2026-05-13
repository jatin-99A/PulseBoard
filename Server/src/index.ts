import { createServer } from 'node:http';

import { setupApp } from './app/index.js';
import env from './config/env.js';
import { testDbConnection } from './db/index.js';

async function startServer() {
  try {
    const PORT = env.PORT || 8001;

    await testDbConnection();

    const server = createServer(setupApp());

    server.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Error starting http server`);
    throw error;
  }
}

startServer();
