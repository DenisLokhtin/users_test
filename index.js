const express = require('express');
const cors = require('cors');
const mysqlDb = require('./mysqlDb');
const users = require('./app/users');
const friends = require('./app/friends');
require('dotenv').config()

const app = express();
const port = process.env.API_PORT;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/users', users);
app.use('/friends', friends);

mysqlDb.connect();

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});