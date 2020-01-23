var express = require('express');
var router = express.Router();
let ejs = require("ejs");
let pdf = require("html-pdf");
let fs = require("fs");
let path = require("path");

var Patient = require('../models/Patient');

function sortTypeToNumber(sortType) {
    if (sortType === 'desc') {
        return -1;
    }  else {
        return 1;
    }
}

/* GET PATIENT BOOKS */
router.get('/', function (req, res, next) {
    let operator = "$or";
    let filters = [];

    let specialFilters = ['sort', 'sortType'];

    Object.keys(req.query).forEach(function (key) {
        if (specialFilters.indexOf(key) < 0) {
            var filterRegex = {"$regex": new RegExp(req.query[key].toLowerCase(), 'i')};
            filters.push({[key]: filterRegex})
        } else {
            console.info(key, 'can not be used as search parameter')
        }
    });

    let condition = {};
    if (filters.length > 0) {
        condition = {[operator]: filters}
    }

    let sort = {'createdAt': -1};
    if (req.query.sort) {
        if (req.query.sortType) {
            sort = {[req.query.sort]: sortTypeToNumber(req.query.sortType)}
        }
    }

    console.log(sort);
    Patient.find(condition)
        .collation({ locale: "fr", strength: 1 })
        .sort(sort)
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
    Patient.update({ _id: req.params.id }, { $set: req.body}, {runValidators: true, new: false}, function (err) {
        if (err) return next(err);
        Patient.findById(req.params.id, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    });
});

/* UPDATE PATIENT */
router.get('/:id/consultations/:consultationId/invoice', function (req, res, next) {

    /*var html = fs.readFileSync('./data/invoice-template.html', 'utf8');
    var options = {
        format: 'Letter'
    };

    console.log(html);
    pdf.create(html, options).toFile('./data/businesscard.pdf', function(err, data) {
        console.log(data);
        if (err) {
            res.send(err);
        } else {
            res.send("File created successfully");
        }
    });*/

    let students = [
        {name: "Joy",
            email: "joy@example.com",
            city: "New York",
            country: "USA"},
        {name: "John",
            email: "John@example.com",
            city: "San Francisco",
            country: "USA"},
        {name: "Clark",
            email: "Clark@example.com",
            city: "Seattle",
            country: "USA"},
        {name: "Watson",
            email: "Watson@example.com",
            city: "Boston",
            country: "USA"},
        {name: "Tony",
            email: "Tony@example.com",
            city: "Los Angels",
            country: "USA"
        }];

    ejs.renderFile(path.join(__dirname, '../../data/', "invoice-template.ejs"), {students: students}, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(data, options).toStream(function (err, stream) {
                if (err) {
                    res.send(err);
                } else {
                    var filename = "invoice.pdf";
                    var mimetype = "application/pdf";

                    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                    res.setHeader('Content-type', mimetype);

                    stream.pipe(res);
                }
            });
        }
    });
    //res.send("test");
});


module.exports = router;