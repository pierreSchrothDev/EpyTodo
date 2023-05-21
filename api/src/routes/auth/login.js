const { query } = require('express');
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
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
router.post('/', async (req, res) => {
    const data = req.body;
    const status = {
        'msg': 'Invalid Credentials'
    }
    try{
        const query = "SELECT * FROM user WHERE email = '" + data.email + "'";
        connection.query(
            query,
            function(err, results, fields) {
                if (results.length > 0) {
                    bcrypt.compare(data.password, results[0].password, function(err, result) {
                        if (result) {
                            const token = jwt.sign(results[0], process.env.SECRET, { expiresIn: '1800s' });
                            console.log('New log in: ' + token);
                            res.send({'token': token});
                        }
                        else {
                            res.send(status);
                        }
                    });
                }
                else {
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
});

module.exports = router;