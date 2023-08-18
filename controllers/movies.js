const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');

const getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const _id = req.params.movieId;
  Movie.findById(_id).then((movie) => {
    if (!movie) {
      throw new NotFoundError('Фильм не найден.');
    }
    if (!movie.owner.equals(req.user._id)) {
      throw new ForbiddenError();
    }
    return Movie.deleteOne(movie).then(() => res.status(200).send({ message: 'Фильм удалён' }));
  })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError());
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};
