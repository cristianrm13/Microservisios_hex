import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Usuario, { IUsuario } from '../../domain/models/usuario';
import { logAudit } from '../../../../Notificaciones/src/services/auditService';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import amqp from 'amqplib';


export class UserController {
    constructor() { }

    // Crear un nuevo usuario
    crearUsuario = async (req: Request, res: Response) => {
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
    // Validacion de usuario usando JWT
  loginUsuario = async (req: Request, res: Response) => {
        try {
            const { correo, contrasena } = req.body;
            const usuario = await Usuario.findOne({ where: { correo } });

            if (!usuario || usuario.contrasena !== contrasena) {
                return res.status(401).send({ error: 'Credenciales no válidas.' });
            }

            usuario.fecha_operacion	 = new Date();
            await usuario.save();

            const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || 'holatutu');
            res.send({ usuario, token });
        } catch (error) {
            res.status(400).send(error);
        }
    };

    // Obtener todos los usuarios
    obtenerUsuarios = async (req: Request, res: Response) => {
        try {
            const usuarios = await Usuario.findAll();
            res.status(200).send(usuarios);
        } catch (error) {
            res.status(500).send(error);
        }
    };

    // Obtener un usuario por ID
    obtenerUsuarioPorId = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).send({ error: 'Usuario no encontrado' });
            }

            usuario.fecha_operacion	 = new Date();
            await usuario.save();

            res.status(200).send(usuario);
        } catch (error) {
            res.status(500).send(error);
        }
    };

    // Actualizar un usuario por ID
    actualizarUsuario = async (req: Request, res: Response) => {
        const updates = Object.keys(req.body) as Array<keyof typeof Usuario>;
        const allowedUpdates: Array<keyof Usuario> = ['nombre', 'correo', 'contrasena', 'telefono'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update as keyof Usuario));
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Actualización no permitida' });
        }

        try {
            const usuario = await Usuario.findByPk(req.params.id);
            if (!usuario) {
                return res.status(404).send({ error: 'Usuario no encontrado' });
            }

            updates.forEach((update) => {
                (usuario as any)[update] = req.body[update];
            });
            usuario.fecha_operacion	 = new Date();
            await usuario.save();
            res.status(200).send(usuario);
        } catch (error) {
            res.status(400).send(error);
        }
    };
    // Eliminar un usuario por ID
    eliminarUsuario = async (req: Request, res: Response) => {
        try {
            const usuario = await Usuario.findByPk(req.params.id);
            if (!usuario) {
                return res.status(404).send();
            }

            await usuario.destroy();
            res.status(200).send(usuario);
        } catch (error) {
            res.status(500).send(error);
        }
    };
}


export const crearUsuario = UserController.prototype.crearUsuario;
export const obtenerUsuarios = UserController.prototype.obtenerUsuarios;
export const obtenerUsuarioPorId = UserController.prototype.obtenerUsuarioPorId;
export const actualizarUsuario = UserController.prototype.actualizarUsuario;
export const eliminarUsuario = UserController.prototype.eliminarUsuario;
export const loginUsuario = UserController.prototype.loginUsuario;

