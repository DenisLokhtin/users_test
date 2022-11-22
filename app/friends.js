const express = require("express");
const router = express.Router();
const mysqlDb = require('../mysqlDb');
const dayjs = require('dayjs');

//all friends
router.get('/', async (req, res) => {
    try {
        const [FriendsAll] = await mysqlDb.getConnection().query(
            `SELECT *
             FROM Friends`
        );
        if (!FriendsAll.length) return res.send('friends do not exist')
        res.send(FriendsAll);
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

//add friend
router.post('/', async (req, res) => {
    if (!req.body.userId && !req.body.friendId) {
        return res.status(400).send('Data not valid');
    }

    const [Friends] = await mysqlDb.getConnection().query(
        `SELECT *
         FROM Friends
         WHERE friendId = ${req.body.friendId}`);

    if (Friends.length >= 150) return res.send('you cannot follow more than 150 users')

    const [Friend] = await mysqlDb.getConnection().query(
        `SELECT *
         FROM Friends
         WHERE friendId = ${req.body.friendId}
         AND userId = ${req.body.userId}`);

    if (Friend.length) return res.send('you are already subscribed')

    const friend = {
        userId: req.body.userId,
        friendId: req.body.friendId,
    };

    try {
        const newFriend = await mysqlDb.getConnection().query(
            'INSERT INTO ?? (userId, FriendId) VALUES (?, ?)',
            ['Friends', friend.userId, friend.friendId]
        );

        res.send({
            id: newFriend['0']['insertId'],
            ...friend,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

//delete friend
router.delete('/:id', async (req, res) => {
    try {
        await mysqlDb.getConnection().query(
            'DELETE FROM ?? WHERE id = ? ',
            ['Friends', req.params.id]
        );

        res.send('Delete successful');
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;