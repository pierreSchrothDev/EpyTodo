const { query } = require('express');
const express = require('express');
const router = express.Router();
require('dotenv').config();

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'rootroot',
    database: 'epytodo'
});

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
        try{
            const query = "SELECT * FROM user";
            connection.query(
                query,
                function(err, results, fields) {
                    if (!err) {
                        res.send(results);
                    }
                    else {
                        status.msg = 'Internal server error'
                        res.send(status);
                    }
                }
            );
        }
        catch(e){
            console.log(e);
            status.msg = 'Internal server error'
            res.send(status);
        }
    }
    else {
        status.msg = 'Token is not valid'
        res.send(status);
    }
});

module.exports = router;