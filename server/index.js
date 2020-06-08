const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const VAR = require('../config/variables');
const { apolloServer } = require('./graphql');

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

const server = app.listen(VAR.PORT, () => {
  const { address, port } = server.address();
  /* eslint no-console: "off" */
  console.log(`Server running on ${address}:${port}`);
});