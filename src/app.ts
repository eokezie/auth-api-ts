import express from 'express';
import config from 'config';
import dotenv from 'dotenv';
import connectToDb from './utils/connectToDb';
dotenv.config();
import router from './routes';

const app = express();

app.use(express.json());
app.use(router);

const port = config.get('port');

app.listen(port, () => {
    connectToDb();
    console.log(`App started at http://localhost:${port}`);
});