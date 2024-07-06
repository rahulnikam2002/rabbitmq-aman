const amqp = require("amqplib");

async function sendMail() {
  try {
    // Connection
    const connection = await amqp.connect("amqp://localhost");

    // channel create
    const channel = await connection.createChannel();

    // static vars
    const exchange = "mail_exchange";
    const routing_key = "send_mail";
    const queue = "mail_queue";

    const message = {
      from: "newAman@gmail.com",
      to: "newRahul@gmail.com",
      subject: "Hello",
      html: "Hello Rahul",
    };

    // Create exchang & Queue
    await channel.assertExchange(exchange, "direct", { durable: false });
    await channel.assertQueue(queue, { durable: true });

    // Binding & Routing
    await channel.bindQueue(queue, exchange, routing_key);

    // Sending data/msg to exchange
    channel.publish(
      exchange,
      routing_key,
      Buffer.from(JSON.stringify(message))
    );

    console.log("Mail was sent!!", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log("error", error);
  }
}

sendMail();
