const http = require('http');
const fs = require('fs');
const _path = require('path');

const anchorFromString = str => `<a href="${str}">${str}</a>`;

const wrapWithPre = (str) => {
  return `<pre style="word-wrap: break-word; white-space: pre-wrap;">${str}</pre>`;
};

const readFile = (path) => new Promise((res, rej) => {
  fs.readFile(path, (err, file) => {
    if (err) {
      return rej(err);
    }

    return res(file.toString());
  })
});

const readDir = (path) => new Promise((res, rej) => {
  fs.readdir(path, (err, files) => {
    if (err) {
      return rej(err);
    }

    return res(files);
  });
});

const browseDir = (path = './') => new Promise((res, rej) => {
  fs.stat(path, async (err, stats) => {
    if (err) {
      return rej(err);
    }

    if (stats.isFile()) {
      const file = await readFile(path);
      return res([true, file]);
    }

    const dir = await readDir(path);
    return res([false, ['Go back', ...dir]]);
  });
 
});

const runServer = (port) => {
  let currentDir = './';

  http.createServer(async ({ url }, response) => {
    if (url === '/favicon.ico') {
      return response.end();
    } else if (url === '/Go%20back') {
      currentDir = _path.join(currentDir, '../');
    } else {
      currentDir = _path.join(currentDir, url);
    }

    try {
      const [isFile, data] = await browseDir(currentDir);

      if (isFile) {
        response.write(anchorFromString('Go back') + '<br>');
        return response.end(wrapWithPre(data));
      }

      const res = data.map(anchorFromString).join('<br>');
      response.end(res);
    } catch (err) {
      // TODO: When user refreshes page, old url crashes app
      currentDir = './';
      response.writeHead(302, {'Location': '/'});
      response.end();
    }
  }).listen(port, 'localhost');
};

runServer(8000);
