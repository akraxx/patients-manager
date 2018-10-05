import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('combined'));

app.get('/api/test', (req, res) => res.send({"Hello":"World"}));

app.listen(4000, () => console.log(`Express server running on port 4000`));