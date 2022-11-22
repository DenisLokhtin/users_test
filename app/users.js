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
        if (!UsersAll.length) return res.send('users do not exist')
        res.send(UsersAll);
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

//top 5 following users
router.get('/max-following', async (req, res) => {
    try {
        const [MaxFollowers] = await mysqlDb.getConnection().query(
            `select Friends.userId,
                    Friends.subscribers,
                    Users.firstName,
                    Users.gender
             from (
                      select userId, count(*) as subscribers
                      from Friends
                      group by userId
                      order by count(*) desc limit 5
                  ) as Friends
                      left join Users on Users.id = Friends.userId`
        );
        if (!MaxFollowers.length) return res.send('users do not exist')
        res.send(MaxFollowers);
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

//list of users with 0 following
router.get('/not-following', async (req, res) => {
    try {
        const [NotFollowers] = await mysqlDb.getConnection().query(
            `SELECT *
             FROM Users
             WHERE id NOT IN (Select Friends.friendId FROM Friends)`
        );
        if (!NotFollowers.length) return res.send('users with 0 following do not exist');
        res.send(NotFollowers);
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

// user
router.get('/:id', async (req, res) => {
    try {
        const [User] = await mysqlDb.getConnection().query(
            `Select *
             from Users
             where id = ${req.params.id}`);

        if (!User.length) return res.send('user do not exist');

        res.send(User[0]);
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

// user with friends list
router.get('/:id/friends', async (req, res) => {
    try {
        const [User] = await mysqlDb.getConnection().query(
            `Select *
             from Users
             where id = ${req.params.id}`);

        if (!User.length) return res.send('user do not exist');

        const [SubscriptionsAll] = await mysqlDb.getConnection().query(
            `Select *
             from Users
             where id in (select FriendId from Friends where userId = ${req.params.id})
             ORDER BY id ${req.query.order_type}`);

        res.send({user: User[0], subscriptions: SubscriptionsAll});
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

//edit user
router.put('/:id', async (req, res) => {
    if (!req.body.firstName && !req.body.gender) {
        return res.status(400).send('Data not valid');
    }

    const user = {
        firstName: req.body.firstName,
        gender: req.body.gender,
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