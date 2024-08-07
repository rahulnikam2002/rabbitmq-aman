const amqp = require("amqplib");

async function consumer() {
  try {
    // Connection
    const connection = await amqp.connect("amqp://localhost");

    // channel create
    const channel = await connection.createChannel();

    // static vars
    const queue = "lib_queue";

    await channel.assertQueue(queue, { durable: true });

    console.log("Waiting for msgs:: Author");

    channel.consume(queue, async (message) => {
      if (message !== null) {
        const msg = JSON.parse(message.content);
        console.log("Message recv for author service...", msg); //NO
        console.log("----------------------------"); //no
        console.log("Sending mail to author"); //no

        await sendMail(msg); //Sendig started
        console.log("----------------------------"); // Yes
        console.log("Mail sent to author"); // Yes
        //Hame msg mil gaya
        channel.ack(message);
      }
    });

    // No consume
  } catch (error) {
    console.log("error in consumer", error);
  }
}

consumer();

const sendMail = async () =>
  new Promise((res, rej) => {
    setTimeout(() => res(), 2000);
  });
