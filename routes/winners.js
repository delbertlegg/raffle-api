var express = require("express");
var router = express.Router();
var common = require("../public/javascripts/common");
var deserializer = require('../public/javascripts/deserializer');

const getWinnersQuery =
    "SELECT w.*, r.name as raffle_name, p.* from winner w " +
    "INNER JOIN raffle r on w.raffle_id = r.raffle_id " +
    "INNER JOIN person p on w.person_id = p.person_id ";

router.get("/", function (req, res) {
    var raffleId = req.query.id;
    var query = getWinnersQuery;
    if (raffleId) {
        query += "WHERE w.raffle_id = ?";
    }
    var connection = common.getConnection();
    connection.query(query, [req.query.id || null], function (
        error,
        results,
        fields
    ) {
        if (error) throw error;
        const winners = results.map(result =>
            deserializer.winnerDeserializer(result)
        );
        connection.end();
        common.handleSuccess(res, winners);
    });
});

router.post("/", function (req, res) {
    var entry = req.body;
    var query =
        "INSERT INTO winner (raffle_id, ticket_number, person_id, prize_claimed_flag) " +
        "VALUES(?, ?, ?, 0)";
    var connection = common.getConnection();
    connection.query(
        query,
        [entry.id, entry.ticketNumber, entry.winner.id],
        function (error, result) {
            if (error) throw error;
            getWinner(res, entry, connection);
        }
    );
});

router.put("/:id", function (req, res) {
    var entry = req.body;
    var query =
        "UPDATE winner SET ticket_number = ?, person_id = ?, prize_claimed_flag = ? WHERE raffle_id = ?";
    var connection = common.getConnection();
    connection.query(
        query,
        [entry.ticketNumber, entry.winner.id, entry.prizeClaimed ? 1 : 0, entry.id],
        function (error, result) {
            if (error) throw error;
            getWinner(res, entry, connection);
        }
    );
});

function getWinner(res, entry, conn) {
    conn.query(
        getWinnersQuery + "WHERE w.raffle_id = ?",
        [entry.id],
        function (error, results, fields) {
            if (error) throw error;
            conn.end();
            common.handleSuccess(res, deserializer.winnerDeserializer(results[0]));
        }
    );
}

module.exports = router;