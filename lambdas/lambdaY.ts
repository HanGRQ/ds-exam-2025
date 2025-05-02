import { Handler } from "aws-lambda";

export const handler: Handler = async (event: SNSEvent) => {
  try {
    console.log("Event: ", JSON.stringify(event));

    for (const record of event.Records) {
      const message = JSON.parse(record.Sns.Message);
      const hasEmail = message.email && message.email.trim() !== "";

      if (!hasEmail) {
        const queueUrl = process.env.QUEUE_B_URL!;
        await sqsClient.send(
          new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(message),
          })
        );
        console.log("Message redirected to Queue B due to missing email");
      } else {
        console.log("Message has email, no action taken.");
      }
    }

  } catch (error: any) {
    console.error("Lambda Y Error: ", error);
    throw new Error(JSON.stringify(error));
  }
};

