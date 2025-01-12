// функція отримання назв полів з БД
function getBDFields(pool,arrayOfAddedParams) {
    return new Promise((resolve, reject) => {
        // Назва таблиці, для якої потрібно отримати поля
        const tableName = "test_results"; // Заміни на фактичну назву таблиці

        // Запит для отримання назв полів
        const query = `SHOW COLUMNS FROM ${tableName}`;

        pool.query(query, (error, results) => {
            if (error) {
                return reject("Помилка виконання запиту: " + error);
            }

            // Масив для збереження назв полів
            const arrayofDBfields = results.map((row) => row.Field);

            //console.log("Назви полів таблиці:", arrayofDBfields);
            resolve(arrayofDBfields);
        });
    });
}

module.exports = getBDFields;