const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().uri().required(),
      trailerLink: Joi.string().uri().required(),
      thumbnail: Joi.string().uri().required(),
      owner: Joi.string().required(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }).unknown(true),
  }),
  createMovie,
);

router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().required().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = router;
