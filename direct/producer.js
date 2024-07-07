const amqp = require("amqplib");

async function sendMail() {
  try {
    // Connection
    const connection = await amqp.connect("amqp://localhost");

    // channel create
    const channel = await connection.createChannel();

    // static vars
    const exchange = "mail_exchange";

    const libRoutingKey = "lib_sr_key";
    const userRoutingKey = "user_sr_key";

    const libQueue = "lib_queue";
    const userQueue = "user_queue";

    const authorMessage = {
      bookName: "My Love Story by Aman",
      author: "Aman",
      platform: "Amazon Books",
      price: 50000,
      invoice: "https://google.com",
      authorMailData: {
        from: "amazonbooks@gmail.com",
        to: "aman@gmail.com",
        subject: "cong! you made a purchase",
        html: "Book Name: My Love Story by Aman",
      },
    };

    const userMessage = {
      bookName: "My Love Story by Aman",
      author: "Aman",
      platform: "Amazon Books",
      price: 50000,
      invoice: "https://google.com",
      userMailData: {
        from: "amazonbooks@gmail.com",
        to: "rahulnikam@gmail.com",
        subject: "Thanks for pur. book (My Love Story by Aman)",
        html: "Thank you!",
      },
    };

    // Create exchang & Queue
    await channel.assertExchange(exchange, "direct", { durable: false });

    await channel.assertQueue(libQueue, { durable: true });
    await channel.assertQueue(userQueue, { durable: true });

    // Binding & Routing
    await channel.bindQueue(libQueue, exchange, libRoutingKey);
    await channel.bindQueue(userQueue, exchange, userRoutingKey);

    // Sending data/msg to exchange
    channel.publish(
      exchange,
      libRoutingKey,
      Buffer.from(JSON.stringify(authorMessage))
    );

    channel.publish(
      exchange,
      userRoutingKey,
      Buffer.from(JSON.stringify(userMessage))
    );
    console.log("Mail was sent to author!!", authorMessage);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log("error", error);
  }
}

sendMail();
