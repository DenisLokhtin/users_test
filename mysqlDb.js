const mysql = require('mysql2/promise');
const config = require('./config');
let connection = null;

module.exports = {
    connect: async () => {
        connection = await mysql.createConnection(config.databaseOptions);
        console.log('Connected to MySQL! id = ' + connection.threadId);
    },
    getConnection: () => connection,
}