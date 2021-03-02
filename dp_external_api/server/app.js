import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from 'morgan';

import {AUTH} from './config';
import api from './routes/api';
mongoose.connect(AUTH.mongoConnection, {}, (err, res) => {
    if (err)
        console.log('MongoDB ERROR: cannot connect to ' + AUTH.mongoConnection + '. ' + err);
    else
        console.log('MongoDB: connect successfully');
});
mongoose.Promise = require('bluebird');

let app = express();
app.use(logger('dev'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true}));
app.use(cookieParser());
app.use(cors({credentials: true, origin: true, optionsSuccessStatus: 200}));

app.use('/', api);

module.exports = app;