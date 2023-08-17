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
      image: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?[a-z0-9-._~:/?#[\]@!$&()*+,;=]{1,256}\.[a-z]{2,6}\b([a-z0-9-._~:/?#[\]@!$&()*+,;=]*)/i),
      trailerLink: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?[a-z0-9-._~:/?#[\]@!$&()*+,;=]{1,256}\.[a-z]{2,6}\b([a-z0-9-._~:/?#[\]@!$&()*+,;=]*)/i),
      thumbnail: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?[a-z0-9-._~:/?#[\]@!$&()*+,;=]{1,256}\.[a-z]{2,6}\b([a-z0-9-._~:/?#[\]@!$&()*+,;=]*)/i),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
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
