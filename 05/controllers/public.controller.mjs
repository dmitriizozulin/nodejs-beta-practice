import fs from 'fs';

const FileTypes = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.cjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
};

export default (req, res) => {
  return fs.readFile(`.${req.url}`, (err, data) => {
    if (err) {
      console.log(err);
      res.statusCode = 404;
      return res.end('File not found');
    }

    const extension = req.url.slice(req.url.lastIndexOf('.'));
    res.setHeader('Content-Type', FileTypes[extension]);
    return res.end(data);
  });
};
