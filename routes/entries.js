var express = require('express');
var router = express.Router();
var common = require('../public/javascripts/common');


router.post('/', function (req, res) {
    var successCount = 0;
    var errorCount = 0;
    console.log(req.body.ticketCount);
    var i = 0;
    for (i; i < req.body.ticketCount; i++) {
        var connection = common.getConnection();
        connection.query('INSERT INTO entry (raffle_id, person_id) VALUES(?, ?)', [req.body.raffleId, req.body.personId], function (error, result) {
            if (error) errorCount++;
            else successCount++;
            console.log(`i: ${i}, successCount: ${successCount}, errorCount: ${errorCount}`);
            if (errorCount + successCount === req.body.ticketCount) {
                connection.end();
                common.handleSuccess(res, {
                    successCount: successCount,
                    errorCount: errorCount
                });
            }
        });
    }


});

router.get('/counts', function (req, res) {
    var connection = common.getConnection();
    connection.query('SELECT COUNT(*) AS count from entry WHERE raffle_id = ? GROUP BY person_id', [req.query.raffleId], function (error, result) {
        if (error) throw error;
        connection.end();
        common.handleSuccess(res, result);
    })
})

module.exports = router;