import fs from 'fs';
import path from 'path';

export const urlParser = (url) => new Promise((resolve, reject) => {
  const queryIndex = url.indexOf('query=');

  if (queryIndex === -1) {
    reject('Bad query');
  }

  const query = url.slice(queryIndex + 6).replaceAll('%20', ' ').replaceAll('\\\\', '\\');

  resolve(query);
});

export const fileExplorer = (_path) => new Promise((resolve, reject) => {
  const isFile = fs.statSync(_path).isFile();

  if (isFile) {
    return fs.readFile(_path, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve({isFile: true, data: data.toString()});
    });
  }

  fs.readdir(_path, (err, files) => {
    if (err) {
      return reject(err);
    }

    const filesData = files.reduce((arr, val) => {
      const fullpath = _path+val;
      
      try {
        const isValFile = fs.statSync(fullpath).isFile();
        return [...arr, {
          parentPath: _path,
          fullpath,
          path: val,
          isFile: isValFile,
        }];
      } catch (err) {
        return arr;
      }
    }, []);

    return resolve({isFile: false, data: filesData});
  });
});
