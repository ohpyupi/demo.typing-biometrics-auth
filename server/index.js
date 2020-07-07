const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const { PORT } = require('../config/variables');
const { apolloServer } = require('./graphql');
const { initDatabase } = require('./db');

const bootstrap = async () => {
  try {
    await initDatabase();
    const app = express();
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../dist')));
    apolloServer.applyMiddleware({ app });
    /* eslint no-unused-vars: "off" */
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.json({
        message: err.message,
      });
    });
    app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
    const server = app.listen(PORT, () => {
      const { address, port } = server.address();
      /* eslint no-console: "off" */
      console.log(`Server running on ${address}:${port}`);
    });
  } catch (err) {
    console.error(`Failed to run the server => ${err}`);
  }
};

bootstrap();
