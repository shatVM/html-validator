// const fs = require('fs');
// const path = require('path');
// const {getFormattedDateTime, getFormattedDate}  = require('../getFormattedDateTime')

// // Конфігурація
// const logsDirectory = path.join(__dirname, 'logs');  // Папка для зберігання логів
// //const maxLogFiles = 50;  // Максимальна кількість файлів логів для збереження

// // Перевірка наявності папки для логів та створення, якщо її немає
// if (!fs.existsSync(logsDirectory)) {
//     fs.mkdirSync(logsDirectory);
// }

// // Функція для перевірки, чи настав новий день і виклику rotateLogs() при необхідності
// let lastCheckedDate = new Date().getDate();

// function checkNewDay() {
//     const currentDate = new Date().getDate();
//     if (currentDate !== lastCheckedDate) {
//         rotateLogs();
//         lastCheckedDate = currentDate;
//     }
// }

// // Функція для ротації файлів логів
// function rotateLogs() {
//     // Перейменовуємо поточний файл з міткою часу
//     const oldLogFileName = path.join(logsDirectory, 'log-today.txt');
//     if (fs.existsSync(oldLogFileName)) {
//         const newLogFileName = path.join(logsDirectory, `log-${getFormattedDate()}.txt`);
//         fs.renameSync(oldLogFileName, newLogFileName);
//     }

//     // Видаляємо старі файли логів, якщо їх більше ніж maxLogFiles
//     // const logFiles = fs.readdirSync(logsDirectory).filter(file => file.startsWith('log-') && file.endsWith('.txt'));

//     // if (logFiles.length > maxLogFiles) {
//     //     const filesToDelete = logFiles.sort().slice(0, logFiles.length - maxLogFiles);
//     //     filesToDelete.forEach(file => {
//     //         fs.unlinkSync(path.join(logsDirectory, file));
//     //     });
//     // }
// }

// // Функція для запису повідомлень у файл
// async function logToFile(message) {
//     // Перевіряємо чи настав новий день
//     checkNewDay();

//     const logFilePath = path.join(logsDirectory, 'log-today.txt');

//     const timeStampedMessage = `[${getFormattedDateTime()}] ${message}\n`;
//     fs.appendFile(logFilePath, timeStampedMessage, (err) => {
//         if (err) {
//             console.error('Error writing to log file:', err);
//         }
//     });
// }

// // Зберігаємо оригінальні функції консолі
// const originalConsoleLog = console.log;
// const originalConsoleError = console.error;
// const originalConsoleWarn = console.warn;
// const originalConsoleInfo = console.info;

// // Переопределяємо функції консолі для логування
// console.log = (message, ...optionalParams) => {
//     logToFile(`LOG: ${message} ${optionalParams.join(' ')}`);
//     originalConsoleLog(message, ...optionalParams);
// };

// console.error = (message, ...optionalParams) => {
//     logToFile(`ERROR: ${message} ${optionalParams.join(' ')}`);
//     originalConsoleError(message, ...optionalParams);
// };

// console.warn = (message, ...optionalParams) => {
//     logToFile(`WARN: ${message} ${optionalParams.join(' ')}`);
//     originalConsoleWarn(message, ...optionalParams);
// };

// console.info = (message, ...optionalParams) => {
//     logToFile(`INFO: ${message} ${optionalParams.join(' ')}`);
//     originalConsoleInfo(message, ...optionalParams);
// };

// // Експортуємо функції, якщо потрібна додаткова конфігурація
// module.exports = {
//     logToFile
// };


const fs = require('fs');
const path = require('path');
const { getFormattedDateTime, getFormattedDate } = require('../getFormattedDateTime');

// Конфігурація
const logsDirectory = path.join(__dirname, 'logs');  // Папка для зберігання логів
// const maxLogFiles = 50;  // Максимальна кількість файлів логів для збереження

// Перевірка наявності папки для логів та створення, якщо її немає
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

// Функція для отримання вчорашньої дати у форматі YYYY-MM-DD
function getYesterdayFormattedDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);  // Отримання вчорашньої дати
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Функція для перевірки, чи настав новий день і виклику rotateLogs() при необхідності
let lastCheckedDate = new Date().getDate();

function checkNewDay() {
    const currentDate = new Date().getDate();
    if (currentDate !== lastCheckedDate) {
        rotateLogs();
        lastCheckedDate = currentDate;
    }
}

// Функція для ротації файлів логів
function rotateLogs() {
    // Перейменовуємо поточний файл з міткою часу
    const oldLogFileName = path.join(logsDirectory, 'log-today.txt');
    if (fs.existsSync(oldLogFileName)) {
        const newLogFileName = path.join(logsDirectory, `log-${getYesterdayFormattedDate()}.txt`);
        fs.renameSync(oldLogFileName, newLogFileName);
    }

    // Видаляємо старі файли логів, якщо їх більше ніж maxLogFiles
    // const logFiles = fs.readdirSync(logsDirectory).filter(file => file.startsWith('log-') && file.endsWith('.txt'));

    // if (logFiles.length > maxLogFiles) {
    //     const filesToDelete = logFiles.sort().slice(0, logFiles.length - maxLogFiles);
    //     filesToDelete.forEach(file => {
    //         fs.unlinkSync(path.join(logsDirectory, file));
    //     });
    // }
}

// Функція для запису повідомлень у файл
async function logToFile(message) {
    // Перевіряємо чи настав новий день
    checkNewDay();

    const logFilePath = path.join(logsDirectory, 'log-today.txt');

    const timeStampedMessage = `[${getFormattedDateTime()}] ${message}\n`;
    fs.appendFile(logFilePath, timeStampedMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

// Зберігаємо оригінальні функції консолі
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

// Переопределяємо функції консолі для логування
console.log = (message, ...optionalParams) => {
    logToFile(`LOG: ${message} ${optionalParams.join(' ')}`);
    originalConsoleLog(message, ...optionalParams);
};

console.error = (message, ...optionalParams) => {
    logToFile(`ERROR: ${message} ${optionalParams.join(' ')}`);
    originalConsoleError(message, ...optionalParams);
};

console.warn = (message, ...optionalParams) => {
    logToFile(`WARN: ${message} ${optionalParams.join(' ')}`);
    originalConsoleWarn(message, ...optionalParams);
};

console.info = (message, ...optionalParams) => {
    logToFile(`INFO: ${message} ${optionalParams.join(' ')}`);
    originalConsoleInfo(message, ...optionalParams);
};

// Експортуємо функції, якщо потрібна додаткова конфігурація
module.exports = {
    logToFile
};
