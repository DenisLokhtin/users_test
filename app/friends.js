const express = require("express");
const router = express.Router();
const mysqlDb = require('../mysqlDb');
const dayjs = require('dayjs');

router.get('/', async (req, res) => {
    try {
        const [UsersAll] = await mysqlDb.getConnection().query(
            `SELECT *
             FROM Users`
        );
        res.send(UsersAll);
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;