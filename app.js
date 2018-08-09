var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];

var app = express();

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    global.connection = mysql.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.db
    });
    connection.connect();
    next();
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var raffleRouter = require('./routes/raffles');
var personRouter = require('./routes/persons');
var entryRouter = require('./routes/entries');

app.use('/api/v1/raffles', raffleRouter);
app.use('/api/v1/people', personRouter);
app.use('/api/v1/entries', entryRouter);
app.use('/users', usersRouter);

module.exports = app;