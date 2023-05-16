const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');

//Initialise Sql server

//Importing Routes
const root = require('./routes/root.js');
const login = require('./routes/auth/login');
const register = require('./routes/auth/register');
const user = require('./routes/user/user');
const token = require('./routes/user/token');
const todo = require('./routes/user/todo');
const user_id = require('./routes/user/user_id');
const todos_id = require('./routes/todos/todos_id');

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', root);
app.use('/login', login);
app.use('/register', register);
app.use('/user', user);
app.use('/', todo); // /:id/todos
app.use('/users', user_id);
app.use('/todos', todos_id);

//Facultative routes for web app
app.use('/token', token);

//Application Creation
app.listen(4444, () => console.log('Server started on port 4444'));
