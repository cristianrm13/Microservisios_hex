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
        // Registrar auditoría
        await logAudit(usuario.id.toString(), 'create', `Usuario creado: ${nombre}`);

        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET || 'holatutu'
        );

        // Enviar mensaje a RabbitMQ con tipo de evento
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'user_created';

        await channel.assertQueue(queue, { durable: true });

        // Crear mensaje con tipo de evento
        const mensaje = {
            tipo_evento: 'usuario_creado',  // Tipo de evento
            usuario: usuario,               // Datos del usuario
        };

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(mensaje)));
        console.log(' [x] Sent user creation message to RabbitMQ');

        setTimeout(() => connection.close(), 500);

        res.status(201).send({ token, nombre: usuario.nombre });
    } catch (error) {
        console.error('Error en crearUsuario:', error);
        res.status(500).send({ error: 'Error al crear el usuario o enviar el correo.', detalle: (error as any).message });
    }
};
