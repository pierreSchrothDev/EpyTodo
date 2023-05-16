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
router.get('/', async (req, res) => {
    console.log(1);
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
            const query = "SELECT * FROM todo";
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
            var query = "SELECT * FROM todo WHERE id = '" + id + "';";
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

// POST request
router.post('/', function(req, res) {
    var data = req.body;
    var id = req.params.id;
    const status = {
        'msg': 'No token, authorization denied'
    }
    if (!req.headers.token) {
        res.send(status);
        return;
    }
    if (!data.title || !data.description || !data.due_time || !data.user_id || !data.status) {
        status.msg = 'Bad parameter'
        res.send(status);
        return;
    }
    const answer = jwt.decode(req.headers.token);
    if (answer) {
        try{
            var query = "INSERT INTO todo VALUES (NULL, '" + data.title + "', '" + data.description + "', '" + data.due_time + "', '" + data.status + "', '" + data.user_id + "', CURRENT_TIMESTAMP);";
            connection.query(
                query,
                function(err, results, fields) {
                    if (!err) {
                        query = "SELECT * FROM todo WHERE id = '" + results.insertId + "';";
                        connection.query(
                            query,
                            function(err, results, fields) {
                                if (results.length > 0) {
                                    res.send(results);
                                }
                                else {
                                    console.log(err)
                                    status.msg = 'Internal server error'
                                    res.send(status);
                                }
                            }
                        );
                    }
                    else {
                        console.log(err)
                        status.msg = 'Internal server error'
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


//PUT request
router.put('/:id', function(req, res) {
    var data = req.body;
    var id = req.params.id;
    const status = {
        'msg': 'No token, authorization denied'
    }
    if (!req.headers.token) {
        res.send(status);
        return;
    }
    if (!data.title || !data.description || !data.due_time || !data.user_id || !data.status) {
        status.msg = 'Bad parameter'
        res.send(status);
        return;
    }
    const answer = jwt.decode(req.headers.token);
    if (answer) {
        try{
            var query = "SELECT * FROM todo WHERE id = '" + id + "';";
            connection.query(
                query,
                function(err, results, fields) {
                    if (results.length > 0) {
                        query = "UPDATE todo SET title = '" + data.title + "', description = '" + data.description + "', due_time = '" + data.due_time + "', user_id = '" + data.user_id + "', status = '" + data.status + "' WHERE id = '"  + id + "';";
                        connection.query(
                            query,
                            function(err, results, fields) {
                                if (!err) {
                                    query = "SELECT * FROM todo WHERE id = '" + id + "';";
                                    connection.query(
                                        query,
                                        function(err, results, fields) {
                                            if (!err) {
                                                res.send(results);
                                            }
                                            else {
                                                console.log(err);
                                                status.msg = 'Internal server error'
                                                res.send(status);
                                            }
                                        }
                                    )
                                }
                                else {
                                    console.log(err);
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
            var query = "SELECT * FROM todo WHERE id = '" + id + "';";
            connection.query(
                query,
                function(err, results, fields) {
                    if (results.length > 0) {
                        query = "DELETE FROM todo WHERE id = '" + id + "';";
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