const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');
const { poll } = require('./utils/sqsConsumer');

const port = process.env.PORT || 3005;
const server = app.listen(port, () => {
  console.log(`Notification Service running on port ${port}`);
  // Start SQS consumer in background
  poll().catch((err) => console.error('SQS consumer crashed:', err.message));
});

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});
