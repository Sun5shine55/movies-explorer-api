const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMyData,
  updateUserData,
} = require('../controllers/users');

router.get('/users/me', getMyData);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }).unknown(true),
}), updateUserData);

module.exports = router;
