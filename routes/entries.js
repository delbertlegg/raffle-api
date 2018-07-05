var express = require('express');
var router = express.Router();
var common = require('../public/javascripts/common');


router.post('/', function (req, res) {
    global.connection.query('INSERT INTO entry (raffle_id, person_id) VALUES(?, ?)', [req.body.raffleId, req.body.personId], function (error, result) {
        if (error) throw error;
        common.handleSuccess(res, result);
    });
});

router.get('/counts', function (req, res) {
    global.connection.query('SELECT COUNT(*) AS count from entry WHERE raffle_id = ? GROUP BY person_id', [req.query.raffleId], function (error, result) {
        if (error) throw error;
        common.handleSuccess(res, result);
    })
})

module.exports = router;