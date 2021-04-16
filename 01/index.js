const colors = require('colors');

function isPrime(number) {
  let isPrimeFlag = true;

  for (let d = 2; (d <= Math.sqrt(number)) && isPrimeFlag; d++) {
    if (number % d === 0) {
      isPrimeFlag = false;
    }
  }

  return isPrimeFlag;
}

function primePrinter() {
  const consoleColors = [colors.green, colors.yellow, colors.red];
  let currentColorIndex = 0;

  return (prime) => {
    console.log(consoleColors[currentColorIndex](prime));
    currentColorIndex = (currentColorIndex + 1) % consoleColors.length;
  }
}

function invokeRangeError() {
  console.log(colors.red('Wrong range! Please specify two numbers as arguments -- start and end of range'));
  process.exit(1)
}

function checkRange(range) {
  for (let val of range) {
    if (isNaN(val)) {
      invokeRangeError();
    }
  }
}

if (process.argv.length < 4) {
  invokeRangeError();
}

const range = process.argv.slice(2, 4).map(val => parseInt(val));
checkRange(range)

const start = Math.min(...range);
const end = Math.max(...range);
const primes = [];
for (let assumingPrime = start; assumingPrime <= end; assumingPrime++) {
  if (isPrime(assumingPrime)) {
    primes.push(assumingPrime);
  }
}

if (primes.length === 0) {
  console.log(colors.red('No prime numbers found!'));
} else {
  const printPrime = primePrinter();
  primes.forEach(printPrime);
}