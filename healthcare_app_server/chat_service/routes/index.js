var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function (req, resp, next) {
  resp.send("<h1>Chat Service</h1>")
})

module.exports = router;
