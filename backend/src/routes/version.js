var express = require('express');
var fs = require('fs');
var router = express.Router();

const VERSION_FILEPATH = process.env.VERSION_FILEPATH || 'version.json';

router.get('/', function (req, res, next) {
    fs.readFile(VERSION_FILEPATH, "utf8", function(err, data){
        if(err) next(err);

        res.status(200).json(JSON.parse(data));
    });
});

module.exports = router;