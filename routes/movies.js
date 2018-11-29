const {
    Movie,
    validateMovie
} = require("../api/movies");
const {
    Genre
} = require("../api/genres");
const mongoose = require("mongoose");
const express = require("express");
const moment = require("moment");
const router = express.Router();

router.get("/", async (req, res) => {
    const movies = await Movie.find()
        .select("-__v")
        .sort("name");
    res.send(movies);
});

router.get("/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id).select("-__v");

    if (!movie)
        return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
});

router.post("/", async (req, res) => {
    const {
        error
    } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        like: req.body.like,
        publishDate: moment().toJSON()
    });
    await movie.save();

    res.send(movie);
});

router.put("/:id", async (req, res) => {
    const {
        error
    } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = await Movie.findByIdAndUpdate(
        req.params.id, {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
            like: req.body.like
        }, {
            new: true
        }
    );

    if (!movie)
        return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
});

router.delete("/:id", async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie)
        return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
});

module.exports = router;