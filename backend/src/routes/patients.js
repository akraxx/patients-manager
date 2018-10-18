var express = require('express');
var router = express.Router();
var Patient = require('../models/Patient');

/* GET ALL BOOKS */
router.get('/', function(req, res, next) {
    Patient.find(function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function(req, res, next) {
    Patient.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* SAVE BOOK */
router.post('/', function(req, res, next) {
    Patient.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* UPDATE BOOK */
router.put('/:id', function(req, res, next) {
    Patient.findByIdAndUpdate(req.params.id, req.body, {runValidators: true}, function (err) {
        if (err) return next(err);
        Patient.findById(req.params.id, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    });
});

module.exports = router;