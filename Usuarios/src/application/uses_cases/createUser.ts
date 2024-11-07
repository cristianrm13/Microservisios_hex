import { Request, Response } from 'express';
import Usuario from '../../domain/models/usuario';
import { logAudit } from '../../../../Notificaciones/src/services/auditService';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import amqp from 'amqplib';

export const crearUsuarioService = async (req: Request, res: Response) => {
    try {
        const { nombre, correo, contrasena, telefono } = req.body;

        const correoExistente = await Usuario.findOne({ where: { correo } });
        if (correoExistente) {
            return res.status(400).json({ error: 'El correo ya está en uso.' });
        }

        const codigo_verificacion = crypto.randomBytes(3).toString('hex');
        const usuario = await Usuario.create({
            nombre,
            correo,
            contrasena,
            telefono,
            codigo_verificacion,
        });

        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET || 'holatutu'
        );

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '221267@ids.upchiapas.edu.mx',
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: '221267@ids.upchiapas.edu.mx',
            to: correo,
            subject: '¡Bienvenido a GladBox!',
            text: `¡Hola ${nombre}!, tu código de verificación es: ${codigo_verificacion}`,
            html: `<div style="text-align: center; font-family: Arial, sans-serif;">
                        <h1>¡Hola ${nombre}!</h1>
                        <p>Gracias por unirte. Tu código de verificación es:</p>
                        <div style="display: inline-block; padding: 10px; border: 2px solid #000; border-radius: 5px;">
                            <h2>${codigo_verificacion}</h2>
                        </div>
                    </div>`,
        };

        await transporter.sendMail(mailOptions);

// Enviar mensaje a RabbitMQ
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'user_created';

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(usuario)));
        console.log(' [x] Sent user creation message to RabbitMQ');

        setTimeout(() => connection.close(), 500);

        res.status(201).send({ token, nombre: usuario.nombre });
    } catch (error) {
        console.error('Error en crearUsuario:', error);
        res.status(500).send({ error: 'Error al crear el usuario o enviar el correo.', detalle: (error as any).message });
    }
};