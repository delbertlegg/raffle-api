var express = require('express');
var router = express.Router();
var common = require('../public/javascripts/common');
var deserializer = require('../public/javascripts/deserializer');


router.get('/', function (req, res) {
    if (req.query.id) {
        global.connection.query('SELECT * from raffle WHERE raffle_id=?', [req.query.id], function (error, results, fields) {
            if (error) throw error;
            common.handleSuccess(res, deserializer.raffleDeserializer(results[0]));
        });
    } else {
        global.connection.query('SELECT * from raffle', function (error, results, fields) {
            if (error) throw error;
            const raffles = results.map(result => deserializer.raffleDeserializer(result));
            common.handleSuccess(res, raffles);
        });
    }

});

router.get('/draw', function (req, res) {
    var raffleId = req.query.raffleId;
    if (raffleId) {
        drawWinnerForRaffle(raffleId, res);
    } else {
        drawAllWinners(res)
    }
});

router.post('/', function (req, res) {
    global.connection.query('INSERT INTO raffle(name, prize_dscrptn) VALUES(?, ?)', [req.body.name, req.body.prizeDescription], function (error, result) {
        if (error) throw error;
        global.connection.query('SELECT * from raffle where name=?', [req.body.name], function (error, results, fields) {
            if (error) throw error;
            common.handleSuccess(res, deserializer.raffleDeserializer(results[0]));
        });
    });
});



function drawWinnerForRaffle(raffleId, res) {
    var query = "SELECT e.*, p.* " +
        "FROM entry e " +
        "INNER JOIN person p ON e.person_id = p.person_id " +
        "WHERE e.raffle_id = ?";
    global.connection.query(query, [+raffleId], function (error, entryResults, fields) {
        if (error) throw error;
        var randomNumber = Math.ceil(Math.random() * entryResults.length) - 1;
        common.handleSuccess(res, deserializer.personDeserializer(entryResults[randomNumber]));
    });
}

function drawAllWinners(res) {
    var query = "SELECT e.*, p.*, r.name as raffle_name " +
        "FROM entry e " +
        "INNER JOIN person p ON e.person_id = p.person_id " +
        "INNER JOIN raffle r on e.raffle_id = r.raffle_id";
    global.connection.query(query, function (error, entryResults, fields) {
        var results = {};
        var raffleIds = new Set(entryResults.map(entry => entry.raffle_id));
        raffleIds.forEach(id => {
            var raffleEntries = entryResults.filter(entry => entry.raffle_id === id);
            var randomNumber = Math.ceil(Math.random() * raffleEntries.length) - 1;
            var winner = raffleEntries[randomNumber];
            results[winner.raffle_name] = {
                ticketNumber: winner.entry_id,
                winner: deserializer.personDeserializer(winner)
            };
        })
        common.handleSuccess(res, results);
    });
}

module.exports = router;