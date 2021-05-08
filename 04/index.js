const fs = require('fs');
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer');

const selectFile = async (filepath = './') => new Promise((res, rej) => {
  inquirer.prompt({
    message: 'Select log file',
    name: 'selected',
    type: 'list',
    choices: ['../', '.', ...fs.readdirSync(filepath)],
    loop: false,
  }).then(({ selected }) => {
    const isFile = fs.statSync(filepath + selected).isFile();

    if (isFile) {
      return res(path.join(filepath, selected));
    }

    return res(selectFile(filepath + `${selected}/`));
  }).catch(err => rej(err))
})

class LogParser {
  constructor(ips) {
    this.ips = [...ips];
  }

  parseLine(line) {
    this.ips.forEach(ip => {
      if ((new RegExp(`^${ip}`)).test(line)) {
        fs.writeFile(`${__dirname}\\output\\${ip}_requests.log`, line + '\n', { flag: 'a' }, () => {});
      }
    });
  }
}

(async () => {
  let logsFileSize, filepath;
  try {
    filepath = await selectFile();
    logsFileSize = fs.statSync(filepath).size;
  } catch (err) {
    console.error('Can\'t open file. File might not exist.', err);
    process.exit(1);
  }

  const logsFileStream = fs.createReadStream(filepath);

  const lineStream = readline.createInterface({
    input: logsFileStream,
  });

  const logParser = new LogParser(['89.123.1.41', '34.48.240.111']);

  console.log(`Reading file...`);
  lineStream.on('line', line => {
    logParser.parseLine(line);
  })

  lineStream.on('close', () => console.log(`File reading has ended`));
})();
