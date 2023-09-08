const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes/index');

const app = express();
app.disable('x-powered-by');
app.use(cookieParser());
app.use(helmet());
app.use(bodyParser.json());

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/moviedb').then(() => {
});

app.use(cors({
  origin: 'https://chamomile.nomoredomains.xyz',
  credentials: true,
}));
app.use(requestLogger); // подключаем логгер запросов
app.use(router);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errorHandler);

app.listen(PORT, () => {
});
