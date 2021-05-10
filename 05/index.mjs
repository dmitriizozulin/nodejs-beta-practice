import http from 'http';

import mainController from './controllers/main.controller.mjs';

const runHttpServer = (port) => {
  http.createServer(mainController).listen(port, () => console.log(`Listening on http://localhost:${port}/`));
};

runHttpServer(8000);
