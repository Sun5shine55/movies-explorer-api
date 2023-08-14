const rateLimiter = require('express-rate-limit');

const limitReq = rateLimiter({
  windowMs: 10000,
  max: 100,
  message: 'Количество запросов на сервер с одного IP в единицу времени превышено.',
});

module.exports = limitReq;
