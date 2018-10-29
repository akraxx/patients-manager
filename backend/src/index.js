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

const MONGOHOST = process.env.MONGO_HOST || 'localhost';
const MONGOPORT = process.env.MONGO_PORT || 27017;

const dbURI = 'mongodb://'+MONGOHOST+':'+MONGOPORT+'/patientsManager';

const db = mongoose.connection;

db.on('connecting', function() {
    console.log('connecting to MongoDB...');
});

db.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});
db.on('connected', function() {
    console.log('MongoDB connected!');
});
db.once('open', function() {
    console.log('MongoDB connection opened!');
});
db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    setTimeout(function() {mongoose.connect(dbURI, {auto_reconnect:true}) }, 5000);
});
mongoose.connect(dbURI, {auto_reconnect:true});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.error(err);
    if (err.name === 'ValidationError') {
        res.status(422).json(err);
    } else {
        // render the error page
        res.status(err.status || 500).json(err);
        res.send(err.status);
    }
});

module.exports = app;

app.listen(4000, () => console.log(`Express server running on port 4000`));