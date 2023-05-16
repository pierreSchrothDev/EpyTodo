const express = require('express');
const router = express.Router();
require('dotenv').config();

const jwt = require('jsonwebtoken');

// POST request
router.get('/', async (req, res) => {
    const data = req.headers;
    const status = {
        'msg': 'No token, authorization denied'
    }
    if (!data.token) {
        res.send(status);
        return;
    }
    const answer = jwt.decode(data.token);
    if (answer) {
        res.send(answer);
    }
    else {
        status.msg = 'Token is not valid'
        res.send(status);
    }
});

module.exports = router;