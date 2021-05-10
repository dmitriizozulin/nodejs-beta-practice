import fs from 'fs';

import filesController from './files.controller.mjs';
import publicController from './public.controller.mjs';

export default (req, res) => {
  if (req.url === '/favicon.ico') {
    return res.end();
  }
  
  if (req.url === '/') {
    return fs.readFile('./public/index.htm', (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        return res.end();
      }

      res.setHeader('Content-Type', 'text/html');
      return res.end(data);
    });
  }

  if (req.url.startsWith('/public/')) return publicController(req, res);

  if (req.url.startsWith('/files')) return filesController(req, res);

  res.statusCode = 404;
  return res.end('File not found.');
};
