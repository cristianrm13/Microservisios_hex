import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const runConsumer = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'user_created';

    await channel.assertQueue(queue, { durable: true });
    console.log(" [*] Waiting for messages in %s", queue);

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const usuario = JSON.parse(msg.content.toString());
            console.log(" [x] Received %s", usuario);

            // Configura transporte de correo
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '221267@ids.upchiapas.edu.mx',
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
            });

            const mailOptions = {
                from: '221267@ids.upchiapas.edu.mx',
                to: usuario.correo,
                subject: '¡Bienvenido a GladBox!',
                html: `<div style="text-align: center; font-family: Arial, sans-serif;">
                        <h1>¡Hola ${usuario.nombre}!</h1>
                        <p>Gracias por unirte. Tu código de verificación es:</p>
                        <div style="display: inline-block; padding: 10px; border: 2px solid #000; border-radius: 5px;">
                            <h2>${usuario.codigo_verificacion}</h2>
                        </div>
                    </div>`,
            };

            await transporter.sendMail(mailOptions);
            console.log("Correo enviado a: ", usuario.correo);

            // Enviar mensaje de WhatsApp usando Twilio
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            await client.messages.create({
                body: `¡Hola ${usuario.nombre}! Gracias por unirte a GladBox. Tu código de verificación es: ${usuario.codigo_verificacion}`,
                from: 'whatsapp:+14155238886', 
                to: `whatsapp:+521${usuario.telefono}`
            });
            console.log("Mensaje de WhatsApp enviado a: ", usuario.telefono);

            channel.ack(msg);
        }
    });
};

runConsumer().catch(console.error);
