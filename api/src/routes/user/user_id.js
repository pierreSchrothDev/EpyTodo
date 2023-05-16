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

// GET request
router.get('/:id', function(req, res) {
    var data = req.headers;
    var id = req.params.id;
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
            var query = "SELECT * FROM user WHERE id = '" + id + "';";
            connection.query(
                query,
                function(err, results, fields) {
                    if (results.length > 0) {
                        res.send(results);
                    }
                    else {
                        query = "SELECT * FROM user WHERE email = '" + id + "';";
                        connection.query(
                            query,
                            function(err, results, fields) {
                                if (results.length > 0) {
                                    res.send(results);
                                }
                                else {
                                    status.msg = 'Not Found'
                                    res.send(status);
                                }
                            }
                        );
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

//PUT request
router.put('/:id', function(req, res) {
    console.log("we're in")
    var data = req.body;
    var id = req.params.id;
    const status = {
        'msg': 'No token, authorization denied'
    }
    if (!req.headers.token) {
        res.send(status);
        return;
    }
    if (!data.email || !data.password || !data.firstname || !data.name) {
        status.msg = 'Bad parameter'
        res.send(status);
        return;
    }
    const answer = jwt.decode(req.headers.token);
    if (answer) {
        try{
            var query = "SELECT * FROM user WHERE id = '" + id + "';";
            connection.query(
                query,
                function(err, results, fields) {
                    if (results.length > 0) {
                        query = "UPDATE user SET email = '" + data.email + "', firstname = '" + data.firstname + "', name = '" + data.name + "', password = '" + data.password + "' WHERE id = '" + id + "';";
                        connection.query(
                            query,
                            function(err, results, fields) {
                                if (!err) {
                                    query = "SELECT * FROM user WHERE id = '" + id + "';";
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
                                    )
                                }
                                else {
                                    status.msg = 'Internal server error'
                                    res.send(status);
                                }
                            }
                        );
                    }
                    else {
                        status.msg = 'Not Found'
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

//DELETE request
router.delete('/:id', function(req, res) {
    var data = req.headers;
    var id = req.params.id;
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
            var query = "SELECT * FROM user WHERE id = '" + id + "';";
            connection.query(
                query,
                function(err, results, fields) {
                    if (results.length > 0) {
                        query = "DELETE FROM user WHERE id = '" + id + "';";
                        connection.query(
                            query,
                            function(err, results, fields) {
                                if (err) {
                                    status.msg = 'Internal server error'
                                    res.send(status);
                                }
                                else {
                                    status.msg = 'Successfully deleted record number: ' + id;
                                    res.send(status);
                                }
                            }
                        );
                    }
                    else {
                        status.msg = 'Not found'
                        res.send(status);
                    }
                }
            )
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
