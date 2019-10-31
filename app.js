var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

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

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var raffleRouter = require('./routes/raffles');
var personRouter = require('./routes/persons');
var entryRouter = require('./routes/entries');
var winnerRouter = require('./routes/winners');

app.use('/api/v1/raffles', raffleRouter);
app.use('/api/v1/people', personRouter);
app.use('/api/v1/entries', entryRouter);
app.use('/api/v1/winners', winnerRouter);
app.use('/users', usersRouter);

module.exports = app;