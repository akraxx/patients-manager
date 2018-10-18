import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const router = express.Router();

var apiRouter = require('./routes/patients');
var i18n = require('i18n');
i18n.configure({
    locales: ['fr']
});

app.use(i18n.init);
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/api/patients', apiRouter);

mongoose.connect('mongodb://localhost/patientsManager');
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    if (err.name === 'ValidationError') {
        console.error('Error Validating!', err);
        res.status(422).json(err);
    }

    // render the error page
    res.status(err.status || 500);
    res.send(err.status);
});

module.exports = app;

app.listen(4000, () => console.log(`Express server running on port 4000`));