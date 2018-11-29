const express = require('express');
const genres = require('../routes/genres');
const movies = require('../routes/movies');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/genres', genres);
    app.use('/api/movies', movies);
};