const fs = require('fs');
const path = require('path');

function generateInsertQueries(jsonData, tableName) {
    const queries = [];

    for (const item of jsonData) {
        const columns = Object.keys(item).join(', ');
        const values = Object.values(item).map(value => {
            if (typeof value === 'string') {
                // Escape single quotes in string values
                return `'${value.replace(/'/g, "''")}'`;
            }
            return value;
        }).join(', ');

        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
        queries.push(query);
    }

    return queries;
}

function passData(jsonData, tableName) {

    if (Array.isArray(jsonData[tableName])) {
        const insertQueries = generateInsertQueries(jsonData[tableName], tableName);
        return insertQueries;
    } else {
        console.error('Expected "users" array in JSON file');
        return [];
    }
}

function processJsonFile(filePath) {
    const jsonString = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(jsonString);

    const tableNames = Object.keys(jsonData);

    return { tableNames, jsonData };
}


// Usage
const filePath = path.join(__dirname, '../generatedData/fakeData3.json');

const { tableNames, jsonData } = processJsonFile(filePath);
const insertQueries = tableNames.flatMap(tableName => passData(jsonData, tableName));

// insertQueries.forEach(query => console.log(query));

// Write queries to a text file
const outputFilePath = path.join(__dirname, '../outputFiles/insertQueries3.sql');
fs.writeFileSync(outputFilePath, insertQueries.join('\n'), 'utf8');

console.log(`Insert queries have been written to ${outputFilePath}`);