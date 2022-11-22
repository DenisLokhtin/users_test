const express = require("express");
const router = express.Router();
const mysqlDb = require('../mysqlDb');
const dayjs = require('dayjs');

//all users
router.get('/', async (req, res) => {
    try {
        const [UsersAll] = await mysqlDb.getConnection().query(
            `SELECT *
             FROM Users`
        );
        const [FriendsAll] = await mysqlDb.getConnection().query(
            `Select *
             from Users
             where id in (select FriendId from Friends where userId = ${req.params.id})`);

        res.send(UsersAll);
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

//top 5 following users
router.get('/max-following', async (req, res) => {
    try {
        const [UsersAll] = await mysqlDb.getConnection().query(
            `select Friends.userId,
                     Friends.count(*),
                     Users.firstName,
                     Users.gender
              from (
                       select friendId, count(*)
                       from Friends
                       group by friendId
                       order by count(*) desc limit 5
                   ) as Friends
                       left join Users on Users.id = Friends.userId`
            // `SELECT friendId, userId, count(*) as subscribers, firstName, gender
            //  FROM Friends
            //  Left join Users
            //  On Friends.userId = Users.id
            //  Group by friendId
            //  Order by count(*) desc limit 5`
        );
        res.send(UsersAll);
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

//list of users with 0 following
router.get('/not-following', async (req, res) => {
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

//add user
router.post('/', async (req, res) => {
    if (!req.body.firstName && !req.body.gender) {
        return res.status(400).send('Data not valid');
    }

    const user = {
        firstName: req.body.firstName,
        gender: req.body.gender,
    };

    try {
        const newUser = await mysqlDb.getConnection().query(
            'INSERT INTO ?? (firstName, gender) VALUES (?, ?)',
            ['Users', user.firstName, user.gender]
        );

        res.send({
            id: newUser['0']['insertId'],
            ...user,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

// user with friends list
router.get('/:id', async (req, res) => {
    try {
        const [User] = await mysqlDb.getConnection().query(
            `Select *
             from Users
             where id = ${req.params.id}`);

        const [SubscriptionsAll] = await mysqlDb.getConnection().query(
            `Select *
             from Users
             where id in (select FriendId from Friends where userId = ${req.params.id})`);

        res.send({user: User[0], subscriptions: SubscriptionsAll});
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

//edit user
router.put('/:id', async (req, res) => {
    if (!req.body.firstName) {
        return res.status(400).send('Data not valid');
    }

    const user = {
        firstName: req.body.firstName,
    }

    await mysqlDb.getConnection().query(
        'UPDATE ?? SET ? WHERE id = ?',
        ['Users', {...user}, req.params.id]
    );

    const [updatedUser] = await mysqlDb.getConnection().query(
        'SELECT * FROM ?? WHERE id = ?',
        ['Users', req.params.id]
    );

    res.send({
        ...updatedUser['0']
    });
});

//delete user
router.delete('/:id', async (req, res) => {
    try {
        await mysqlDb.getConnection().query(
            'DELETE FROM ?? WHERE id = ? ',
            ['Users', req.params.id]
        );

        res.send('Delete successful');
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;