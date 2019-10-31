var express = require('express');
var router = express.Router();
var common = require('../public/javascripts/common');
var deserializer = require('../public/javascripts/deserializer');


router.get('/', function (req, res) {
    var raffleId = req.query.id;
    var query = 'SELECT * from raffle ';
    if (raffleId) {
        query += 'WHERE raffle_id=?'
    }
    var connection = common.getConnection();
    connection.query(query, [req.query.id || null], function (error, results, fields) {
        if (error) throw error;
        const raffles = results.map(result => deserializer.raffleDeserializer(result));
        connection.end();
        common.handleSuccess(res, raffles);
    });
});

router.get('/draw', function (req, res) {
    var raffleId = req.query.raffleId;
    var query = "SELECT e.*, p.* , r.* " +
        "FROM entry e " +
        "INNER JOIN person p ON e.person_id = p.person_id " +
        "INNER JOIN raffle r ON e.raffle_id = r.raffle_id " +
        "LEFT JOIN winner w on r.raffle_id = w.raffle_id && w.prize_claimed_flag = 0 ";
    if (raffleId) {
        query += "WHERE e.raffle_id = ?";
    }
    var connection = common.getConnection();
    connection.query(query, [+raffleId || null], function (error, entryResults, fields) {
        var results = {};
        var raffleIds = new Set(entryResults.map(entry => entry.raffle_id));
        raffleIds.forEach(id => {
            var raffleEntries = entryResults.filter(entry => entry.raffle_id === id);
            var randomNumber = Math.ceil(Math.random() * raffleEntries.length) - 1;
            var winner = raffleEntries[randomNumber];
            results[winner.raffle_id] = {
                ticketNumber: winner.entry_id,
                raffleName: winner.name,
                winner: deserializer.personDeserializer(winner)
            };
        })
        connection.end();
        common.handleSuccess(res, results);
    });
});

router.post('/', function (req, res) {
    var connection = common.getConnection();
    connection.query('INSERT INTO raffle(name, prize_dscrptn) VALUES(?, ?)', [req.body.name, req.body.prizeDescription], function (error, result) {
        if (error) throw error;
        connection.query('SELECT * from raffle where name=?', [req.body.name], function (error, results, fields) {
            if (error) throw error;
            connection.end();
            common.handleSuccess(res, deserializer.raffleDeserializer(results[0]));
        });
    });
});

module.exports = router;