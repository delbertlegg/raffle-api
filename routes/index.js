var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(JSON.stringify({
    "status": 200,
    "error": null,
    "response": {
      "title": "index"
    }
  }));
});

module.exports = router;