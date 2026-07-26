const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.sendWelcome = catchAsync(async (req, res, next) => {
  const { name, email, url } = req.body;
  if (!name || !email || !url) return next(new AppError('name, email, and url are required', 400));

  const firstName = name.split(' ')[0];
  await new Email(email, firstName, url).sendWelcome();

  res.status(200).json({ status: 'success', message: 'Welcome email sent' });
});

exports.sendPasswordReset = catchAsync(async (req, res, next) => {
  const { name, email, url } = req.body;
  if (!name || !email || !url) return next(new AppError('name, email, and url are required', 400));

  const firstName = name.split(' ')[0];
  await new Email(email, firstName, url).sendPasswordReset();

  res.status(200).json({ status: 'success', message: 'Password reset email sent' });
});
