const fs = require('fs');
const readline = require('readline');

class LogParser {
  constructor(ips) {
    this.ips = [...ips];
  }

  parseLine(line) {
    this.ips.forEach(ip => {
      if ((new RegExp(`^${ip}`)).test(line)) {
        fs.writeFile(`${__dirname}\\${ip}_requests.log`, line + '\n', { flag: 'a' }, () => {});
      }
    });
  }
}

let logsFileSize;
try {
  logsFileSize = fs.statSync('./access.log').size;
} catch (err) {
  console.error('Can\'t open file. File might not exist.');
  process.exit(1);
}

const logsFileStream = fs.createReadStream('./access.log');

const lineStream = readline.createInterface({
  input: logsFileStream,
});

const logParser = new LogParser(['89.123.1.41', '34.48.240.111']);

const logsFileOnePercent = logsFileSize / 100;
let currentSize = 0;
let currentPercent = 0;

console.log(`Reading file: 0%`);
lineStream.on('line', line => {
  if (currentSize >= logsFileOnePercent) {
    currentPercent += currentSize / logsFileOnePercent
    console.log(`Reading file: ${currentPercent.toFixed(0)}%`);
    currentSize -= logsFileOnePercent;
  }

  currentSize += line.length;

  logParser.parseLine(line);
})

lineStream.on('close', () => {
  if (currentPercent < 100) {
    console.log(`Reading file: 100%`);
  }
})
