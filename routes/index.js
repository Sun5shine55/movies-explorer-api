const router = require('express').Router();
const { celebrate, errors, Joi } = require('celebrate');
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { login, createUser, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);
router.use(auth);
router.get('/signout', logout);

router.use('/', auth, userRoutes);
router.use('/', auth, movieRoutes);
router.all('*', (next) => {
  const error = new NotFoundError('Указан неправильный маршрут');
  next(error);
});

router.use(errors());

module.exports = router;
