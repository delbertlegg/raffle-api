var express = require('express');
var router = express.Router();
var common = require('../public/javascripts/common');
var deserializer = require('../public/javascripts/deserializer');


router.get('/', function (req, res, next) {
    global.connection.query('SELECT * from raffle', function (error, results, fields) {
        if (error) throw error;
        const raffles = results.map(result => deserializer.raffleDeserializer(result));
        common.handleSuccess(res, raffles);
    });
});

router.get('/:id', function (req, res, next) {
    global.connection.query('SELECT * from raffle WHERE raffle_id=?', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        common.handleSuccess(res, deserializer.raffleDeserializer(results[0]));
    });
});

router.post('/', function (req, res) {
    console.log(req.body.name);
    global.connection.query('INSERT INTO raffle(name, prize_dscrptn) VALUES(?, ?)', [req.body.name, req.body.prizeDescription], function (error, result) {
        if (error) throw error;
        global.connection.query('SELECT * from raffle where name=?', [req.body.name], function (error, results, fields) {
            if (error) throw error;
            common.handleSuccess(res, deserializer.raffleDeserializer(results[0]));
        });
    });
})



module.exports = router;