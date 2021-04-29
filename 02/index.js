// setTimeout(() => {
//   console.log('Record 2');
//   Promise.resolve().then(() => {
//     setTimeout(() => {
//       console.log('Record 3');
//       Promise.resolve().then(() => {
//         console.log('Record 4');
//       });
//     });
//   });
// });
// console.log('Record 5');
// Promise.resolve().then(() => Promise.resolve().then(() => console.log('Record 6')));
// Answer: 5 -> 6 -> 2 -> 3 -> 4

// -------------------------------------------------------------------------------------

const EventEmitter = require("events");
const dateEmitter = new EventEmitter();

const errors = [];
dateEmitter.on("error", message => {
  errors.push(message);
});
dateEmitter.on("logErrors", () => {
  if (errors.length > 0) {
    errors.forEach(error => {
      console.error(error);
    });
    process.exit(1);
  }
});

// Hours used as seconds for time saving
dateEmitter.on("logDate", ({ date, name }) => {
  let countdown = date[0];

  console.log(`${name}: ${countdown--}`);

  const intervalId = setInterval(() => {
    if (countdown === 0) {
      console.log(`${name}: end`);
      clearInterval(intervalId);
      return;
    }
    console.log(`${name}: ${countdown--}`);
  }, 1000);
});

dateEmitter.on("checkDate", ([hour, day, month]) => {
  if (hour < 0 || hour > 24) {
    dateEmitter.emit("error", `Wrong hour format: ${hour}`);
  }
  if (day < 1 || day > 31) {
    dateEmitter.emit("error", `Wrong day format: ${day}`);
  }
  if (month < 1 || month > 12) {
    dateEmitter.emit("error", `Wrong month format: ${month}`);
  }
});

const logs = [];
dateEmitter.on("log", log => {
  logs.push(log);
});
dateEmitter.on("runLogging", () => {
  dateEmitter.emit("logErrors");

  logs.forEach(log => {
    dateEmitter.emit("logDate", log);
  });
});

// hour-day-month-year
// 13-28-11-2021
dateEmitter.on("parseDateFromArg", arg => {
  const date = arg.split("-").map(number => {
    const parsedNumber = parseInt(number);

    if (isNaN(parsedNumber)) {
      dateEmitter.emit("error", `Value: ${number} is not a number`);
    }

    return parsedNumber;
  });

  dateEmitter.emit("checkDate", date);

  dateEmitter.emit("log", { name: arg, date });
});

process.argv.forEach((arg, i) => {
  if (i < 2) return;

  dateEmitter.emit("parseDateFromArg", arg);
});

dateEmitter.emit("runLogging");
