var express = require('express');
var router = express.Router();
var common = require('../public/javascripts/common');
var deserializer = require('../public/javascripts/deserializer');

/** Get All or get by query parameter */
router.get('/', function (req, res, next) {
    const email = req.query.emailAddress;
    const phoneNumber = req.query.phoneNumber;
    var query, arg;
    if (email || phoneNumber) {
        query = common.buildQuery('person', email ? 'email_address' : 'phone_number');
        arg = email ? email : phoneNumber;
        global.connection.query(query, [arg], function (error, results, fields) {
            if (error) throw error;
            var people = results.map(result => deserializer.personDeserializer(result));
            common.handleSuccess(res, people);
        });
    } else {
        global.connection.query('SELECT * from person', function (error, results, fields) {
            if (error) throw error;
            common.handleSuccess(res, results);
        });
    }

});

/** Get by Id */
router.get('/:id', function (req, res, next) {
    global.connection.query('SELECT * from person WHERE person_id=?', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        common.handleSuccess(res, deserializer.personDeserializer(results[0]));
    });
})

router.post('/', function (req, res) {
    const person = req.body;
    global.connection.query('INSERT INTO person (first_name, last_name, email_address, phone_number) VALUES(?, ?, ?, ?)', [person.firstName, person.lastName, person.emailAddress, person.phoneNumber], function (error, results) {
        if (error) {
            if (error.errno === 1062) {
                // do nothing
            } else throw error;
        };
        global.connection.query('SELECT * from person where email_address=? AND phone_number=?', [person.emailAddress, person.phoneNumber], function (error, queryRes, fields) {
            if (error) throw error;
            common.handleSuccess(res, deserializer.personDeserializer(queryRes[0]));
        });
    });
});

module.exports = router;