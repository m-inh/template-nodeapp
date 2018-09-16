const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('config');
const cors = require('cors');

const db = require('./database');

const port = process.env.PORT || config.get('service.port') || 3001;
const mongoUri = config.get('mongodb.uri');

const app = express();

db.connect(mongoUri)
    .then((msg) => {
        console.log(msg);

        app.use(morgan('dev'));
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded());

        app.get('/ping', (req, res) => {
            return res.send('pong');
        });

        app.use('/api' + config.get('service.route'), require('./api'));

        app.listen(port, (err) => {
            if (!err) console.log(config.get('service.name'), 'is listening on', port);
        });
    })
    .catch(err => {
        throw err;
    });
