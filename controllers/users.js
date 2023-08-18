require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;
const MONGO_ERROR_CONFLIKT = 11000;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 8)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((newUser) => {
      const userWithoutPassword = newUser.toJSON();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === MONGO_ERROR_CONFLIKT) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const getMyData = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const updateUserData = (req, res, next) => {
  const newUser = req.body;
  User.findByIdAndUpdate(req.user._id, newUser, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении пользователя'));
      } else if (err.code === MONGO_ERROR_CONFLIKT) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'here-there-is-my-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 64000000,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      });
      return res.status(200).send({ email });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('jwt', {
    sameSite: 'none',
    secure: true,
  }).send({ message: 'Вы вышли из системы' });
};

module.exports = {
  createUser,
  updateUserData,
  login,
  getMyData,
  logout,
};
