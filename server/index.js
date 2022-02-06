import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import eventRoutes from './routes/events.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use('/events', eventRoutes);
app.use('/auth', authRoutes);

var listener = app.listen(8001, function(){
    console.log('Listening on port ' + listener.address().port);
});