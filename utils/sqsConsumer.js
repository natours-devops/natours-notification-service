const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const Email = require("./email");

const sqs = new SQSClient({ region: process.env.AWS_REGION || "us-east-1" });
const QUEUE_URL = process.env.SQS_BOOKING_QUEUE_URL;

const processMessage = async (message) => {
  const body = JSON.parse(message.Body);
  if (body.type !== "BOOKING_CONFIRMED") return;

  const { userEmail, userName, tourName, price } = body.data;
  const firstName = userName ? userName.split(" ")[0] : "there";
  const url = `${process.env.FRONTEND_URL}/my-tours`;

  await new Email(userEmail, firstName, url).sendBookingConfirmation(
    tourName || "your tour",
    price,
  );
  console.log(`Booking confirmation email sent to ${userEmail}`);
};

const poll = async () => {
  if (!QUEUE_URL) {
    console.warn("SQS_BOOKING_QUEUE_URL not set — SQS consumer not started");
    return;
  }

  console.log("SQS consumer started, polling for messages...");

  while (true) {
    try {
      const { Messages } = await sqs.send(
        new ReceiveMessageCommand({
          QueueUrl: QUEUE_URL,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 20,
        }),
      );

      if (Messages?.length) {
        await Promise.all(
          Messages.map(async (msg) => {
            try {
              await processMessage(msg);
              await sqs.send(
                new DeleteMessageCommand({
                  QueueUrl: QUEUE_URL,
                  ReceiptHandle: msg.ReceiptHandle,
                }),
              );
              console.log("Message processed and deleted successfully");
            } catch (err) {
              // Do NOT delete — let SQS retry and eventually move to DLQ
              console.error(
                "Failed to process message — will retry:",
                err.message,
              );
            }
          }),
        );
      }
    } catch (err) {
      console.error("SQS poll error:", err.message);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
};

module.exports = { poll };
