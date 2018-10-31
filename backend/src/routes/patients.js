var express = require('express');
var router = express.Router();
var Patient = require('../models/Patient');

/* GET PATIENT BOOKS */
router.get('/', function (req, res, next) {
    console.log(req.query);
    let operator = "$or";
    let filters = [];

    Object.keys(req.query).forEach(function (key) {
        var filterRegex = {"$regex": new RegExp('^' + req.query[key].toLowerCase(), 'i')};
        filters.push({[key]: filterRegex})
    });

    let condition = {};
    if (filters.length > 0) {
        condition = {[operator]: filters}
    }

    console.log(condition);

    Patient.find(condition)
        .sort({'createdAt': -1})
        .exec(function (err, patients) {
            if (err) return next(err);
            res.json(patients);
        });
});

/* GET SINGLE PATIENT BY ID */
router.get('/:id', function (req, res, next) {
    Patient.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        if (!post) {
            res.status(404).json({message: "Could not find any patient with id : " + req.params.id});
        } else {
            res.json(post);
        }
    });
});

/* SAVE PATIENT */
router.post('/', function (req, res, next) {
    Patient.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* UPDATE PATIENT */
router.put('/:id', function (req, res, next) {
    Patient.findByIdAndUpdate(req.params.id, req.body, {runValidators: true}, function (err) {
        if (err) return next(err);
        Patient.findById(req.params.id, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    });
});

module.exports = router;