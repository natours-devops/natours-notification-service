const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const notificationRouter = require('./routes/notificationRoutes');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/notifications', notificationRouter);

app.all('*', (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
);
app.use(globalErrorHandler);

module.exports = app;
