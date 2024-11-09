import amqp from 'amqplib';

export async function publishEvent(eventType: string, eventData: any) {
    try {
        const rabbit_uri = process.env.RABBITMQ_HOST;
        if (!rabbit_uri) {
            throw new Error("RABBITMQ_HOST no se definio");
        }
        const connection = await amqp.connect(rabbit_uri);
        const channel = await connection.createChannel();

        const queueName = 'Notificationes';
        await channel.assertQueue(queueName, { durable: true });

        const message = { type: eventType, data: eventData };
        const messageBuffer = Buffer.from(JSON.stringify(message));

        channel.sendToQueue(queueName, messageBuffer);
        console.log(`Evento: ${eventType} publicado en: ${queueName}`, message);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error al publicar el evento:", error);
    }
}