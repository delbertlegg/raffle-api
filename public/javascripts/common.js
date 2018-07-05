module.exports = {
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