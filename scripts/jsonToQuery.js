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

function processJsonFile(filePath, tableName) {
  const jsonString = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(jsonString);

  if (Array.isArray(jsonData.users)) {
    const insertQueries = generateInsertQueries(jsonData.users, tableName);
    return insertQueries;
  } else {
    console.error('Expected "users" array in JSON file');
    return [];
  }
}

// Usage
const filePath = path.join(__dirname, 'users.json');
const tableName = 'users';

const insertQueries = processJsonFile(filePath, tableName);

// Output queries to console (you can modify this to write to a file if needed)
insertQueries.forEach(query => console.log(query));