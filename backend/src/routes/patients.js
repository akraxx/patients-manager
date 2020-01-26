let express = require('express');
let router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
let nodeMailer = require('nodemailer');


const DATA_PATH = process.env.ASSETS_PATH || '/home/max/Documents/workspace/patients-manager/backend/data/';
const INVOICES_GENERATED_PATH = process.env.INVOICES_DIRECTORY || DATA_PATH + 'invoices/generated/';
const INVOICES_TEMPLATES_PATH = process.env.INVOICES_DIRECTORY || DATA_PATH + 'invoices/templates/';
const INVOICES_ASSETS_PATH = process.env.INVOICES_DIRECTORY || DATA_PATH + 'invoices/assets/';

const MAIL_SERVER = process.env.MAIL_SERVER;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

var Patient = require('../models/Patient');

function sortTypeToNumber(sortType) {
    if (sortType === 'desc') {
        return -1;
    } else {
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
        .collation({locale: "fr", strength: 1})
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
    Patient.update({_id: req.params.id}, {$set: req.body}, {runValidators: true, new: false}, function (err) {
        if (err) return next(err);
        Patient.findById(req.params.id, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    });
});

/* DOWNLOAD PATIENT INVOICE */
router.get('/:id/consultations/:consultationId/invoice', function (req, res, next) {
    let patientId = req.params.id;
    let consultationId = +req.params.consultationId;

    getConsultation(patientId, consultationId, next, res, function (patient, consultation) {
        ejs.renderFile(path.join(INVOICES_TEMPLATES_PATH, "ingrid-lhotellier.html.ejs"), {
                patient: patient,
                consultation: consultation,
                assetsPath: "file://" + INVOICES_ASSETS_PATH
            },
            (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    let options = {
                        "format": "A3",
                        "orientation": "portrait"
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
    });
});

/* SEND PATIENT INVOICE BY MAIL */
router.post('/:id/consultations/:consultationId/invoice', function (req, res, next) {
    let patientId = req.params.id;
    let consultationId = +req.params.consultationId;

    getConsultation(patientId, consultationId, next, res, function (patient, consultation) {
        ejs.renderFile(path.join(INVOICES_TEMPLATES_PATH, "ingrid-lhotellier.html.ejs"), {
                patient: patient,
                consultation: consultation,
                assetsPath: "file://" + INVOICES_ASSETS_PATH
            },
            (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    let options = {
                        "format": "A3",
                        "orientation": "portrait"
                    };
                    const filename = patient.lastName.toUpperCase()
                        + '_' + patient.firstName.toLowerCase()
                        + '_' + consultation.date.toLocaleDateString().split('/').join('-')
                        + '.pdf';
                    const absoluteFilePath = INVOICES_GENERATED_PATH + filename;
                    pdf.create(data, options).toFile(absoluteFilePath, function (err, stream) {
                        if (err) {
                            res.send(err);
                        } else {
                            sendInvoiceByMail(res, patient, consultation, absoluteFilePath, filename);
                        }
                    });
                }
            });

    });
});

function sendInvoiceByMail(res, patient, consultation, invoiceFilePath, invoiceFileName) {
    ejs.renderFile(path.join(INVOICES_TEMPLATES_PATH, "mail.html.ejs"), {
            patient: patient,
            consultation: consultation
        },
        (err, data) => {
            if (err) {
                res.status(500).json({message: "Impossible de créer le mail avec la facture : " + err});
            } else {
                let transporter = nodeMailer.createTransport({
                    host: MAIL_SERVER,
                    port: MAIL_PORT,
                    secure: true,
                    requireTLS: true,
                    auth: {
                        user: MAIL_USER,
                        pass: MAIL_PASSWORD
                    }
                });

                transporter.sendMail({
                    from: '"Ingrid Lhotellier" <contact@ingridlhotellier.fr>',
                    to: patient.mail,
                    subject: 'Cabinet Ostéopathie - Eucalyptus - Facture',
                    text: 'Vous trouverez ci-joint votre facture d\'ostéopathie.',
                    html: data,
                    attachments: [{
                        filename: invoiceFileName,
                        path: invoiceFilePath,
                        contentType: 'application/pdf'
                    }]
                }, (error, info) => {
                    if (error) {
                        console.log('Unable to send mail : %s', error);
                        res.status(500).json({message: "Impossible d'envoyer l'email : " + error});
                    } else {
                        console.log('Message %s sent: %s', info.messageId, info.response);
                        res.status(200).json({"message": "email contenant la facture a été envoyé à " + patient.mail});
                    }
                });
            }
        });
}

function getConsultation(patientId, consultationId, next, res, cn) {
    console.log("generating invoice for patient", patientId, "and consultation", consultationId);
    Patient.findById(patientId, function (err, patient) {
        if (err) return next(err);
        if (!patient) {
            res.status(404).json({message: "Could not find any patient with id : " + req.params.id});
        } else {
            console.log("patient has been found, he has", patient.consultations.length, "consultations");

            let consultation = patient.consultations.find(c => c.id === consultationId);
            if (consultation === undefined) {
                res.status(404).json({message: "There is no consultation with id : " + consultationId});
            } else {
                cn(patient, consultation);
            }
        }
    });
}
module.exports = router;