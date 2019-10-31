var mysql = require('mysql');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config')[env];

module.exports = {
    getConnection: function() {
        var connection = mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.db,
            typeCast: function castField(field, useDefaultTypeCasting) {
                if ((field.type === "BIT") && (field.length === 1)) {
                    var bytes = field.buffer();
                    return (bytes[0] === 1);
                }
                return (useDefaultTypeCasting());
            }
        });
        connection.connect();
        return connection;
    },

    handleSuccess: function (res, results) {
        res.send({
            "status": 200,
            "error": null,
            "body": results
        });
    },

    buildQuery: function (tableName, fieldName) {
        return `SELECT * from ${tableName} where ${fieldName} = ?`
    }
}