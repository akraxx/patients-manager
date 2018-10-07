import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const router = express.Router();

app.use(morgan('combined'));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/patientsManager');
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

app.get('/api/test', (req, res) => res.send({"Hello":"World"}));

app.listen(4000, () => console.log(`Express server running on port 4000`));