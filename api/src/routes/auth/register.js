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
router.post('/', async (req, res) => {
    const data = req.body;
    const status = {
        'msg': 'Account already exists'
    }
    try{
        var query = "SELECT * FROM user WHERE email = '" + data.email + "';";
        connection.query(
            query,
            function(err, results, fields) {
                if (results.length > 0) {
                    console.log('nop')
                    res.send(status);
                }
                else {
                    query = "INSERT INTO user VALUES (NULL, '" + data.email + "', '" + data.password + "', '" + data.firstname + "', '" + data.name + "', CURRENT_TIMESTAMP);";
                    connection.query(
                        query,
                        function(err, results, fields) {
                            const token = jwt.sign(data, process.env.SECRET, { expiresIn: '1800s' });
                            res.send({'token': token});
                        }
                    )
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