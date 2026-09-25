const { SQSClient, GetQueueAttributesCommand } = require('@aws-sdk/client-sqs');

const sqs = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1' });

module.exports = (serviceName) => async (req, res) => {
  const health = {
    status: 'UP',
    service: serviceName,
    timestamp: new Date().toISOString(),
    checks: {},
  };

  try {
    await sqs.send(new GetQueueAttributesCommand({
      QueueUrl: process.env.SQS_BOOKING_QUEUE_URL,
      AttributeNames: ['ApproximateNumberOfMessages'],
    }));
    health.checks.sqs = 'UP';
  } catch (err) {
    health.checks.sqs = 'DOWN';
    health.status = 'DOWN';
  }

  res.status(health.status === 'UP' ? 200 : 503).json(health);
};
