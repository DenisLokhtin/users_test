const express = require('express');
const cors = require('cors');
const mysqlDb = require('./mysqlDb');
require('dotenv').config()

require('dotenv').config()
const app = express();
const port = process.env.API_PORT;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());


mysqlDb.connect();

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});