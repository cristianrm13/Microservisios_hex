import { Request, Response } from 'express';
import Usuario, { IUsuario } from '../../domain/models/usuario';
import { logAudit } from '../../services/auditService';

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export class UserController {
    constructor() { }

    // Crear un nuevo usuario
    crearUsuario = async (req: Request, res: Response) => {
        try {
            const { nombre, correo, contrasena, telefono, role = 'user' } = req.body;

            // Verifica si el correo ya existe
            const correoExistente = await Usuario.findOne({ correo });
            if (correoExistente) {
                console.log(`El correo ${correo} ya está registrado.`);
                return res.status(400).json({ error: 'El correo ya está en uso.' });
            }

            const codigoVerificacion = crypto.randomBytes(3).toString('hex');
            console.log(`Código de verificación generado: ${codigoVerificacion}`);

            // Crea el usuario con el rol indicado o el valor predeterminado
            const usuario = new Usuario({
                nombre,
                correo,
                contrasena,
                telefono,
                codigoVerificacion,
                role,
            });
            await usuario.save();
            console.log(`Usuario ${nombre} guardado en la base de datos.`);

            // Registrar auditoría
            await logAudit(usuario._id.toString(), 'create', `Usuario creado: ${nombre}`);

            const token = jwt.sign(
                { _id: usuario._id, role: usuario.role },
                process.env.JWT_SECRET || 'holatutu'
            );
            console.log(`Token JWT generado: ${token}`);

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
                text: `¡Hola ${nombre}!, tu código de verificación es: ${codigoVerificacion}`,
                html: `
                    <div style="text-align: center; font-family: Arial, sans-serif;">
                        <h1>¡Hola ${nombre}!</h1>
                        <p>Gracias por unirte a nuestra comunidad!. Tu código de verificación es:</p>
                        <div style="display: inline-block; padding: 10px; border: 2px solid #000; border-radius: 5px;">
                            <h2>${codigoVerificacion}</h2>
                        </div>
                    </div>
                `,
            };

            const emailResponse = await transporter.sendMail(mailOptions);
            console.log('Correo enviado exitosamente:', emailResponse);

            res.status(201).send({ token, nombre: usuario.nombre, role: usuario.role });
        } catch (error) {
            console.error('Error en crearUsuario:', error);
            res.status(500).send({ error: 'Error al crear el usuario o enviar el correo.' });
        }
    };

    // Validación de usuario usando JWT
    loginUsuario = async (req: Request, res: Response) => {
        try {
            const { correo, contrasena } = req.body;
            const usuario = await Usuario.findOne({ correo });
            if (!usuario || usuario.contrasena !== contrasena) {
                return res.status(401).send({ error: 'Credenciales no válidas.' });
            }
            const token = jwt.sign(
                { _id: usuario._id, role: usuario.role },
                process.env.JWT_SECRET || 'holatutu'
            );

            // Registrar auditoría al logearse
            await logAudit(usuario._id.toString(), 'login', `Usuario inició sesión: ${correo}`);

            // Responder con los datos de usuario, token y rol
            res.send({ usuario, token, role: usuario.role });
        } catch (error) {
            res.status(400).send(error);
        }
    };

    // Obtener todos los usuarios
    obtenerUsuarios = async (req: Request, res: Response) => {
        try {
            const usuarios = await Usuario.find({});
            res.status(200).send(usuarios);
        } catch (error) {
            res.status(500).send(error);
        }
    };

    // Obtener un usuario por ID
    obtenerUsuarioPorId = async (req: Request, res: Response) => {
        const _id = req.params.id;
        try {
            const usuario = await Usuario.findById(_id);
            if (!usuario) {
                return res.status(404).send();
            }
            res.status(200).send(usuario);
        } catch (error) {
            res.status(500).send(error);
        }
    };

    // Actualizar un usuario por ID
    actualizarUsuario = async (req: Request, res: Response) => {
        const updates = Object.keys(req.body) as Array<keyof IUsuario>;
        const allowedUpdates: Array<keyof IUsuario> = ['nombre', 'correo', 'contrasena', 'telefono', 'role'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Actualización no permitida' });
        }

        try {
            const usuario = await Usuario.findById(req.params.id);
            if (!usuario) {
                return res.status(404).send({ error: 'Usuario no encontrado' });
            }

            updates.forEach((update) => {
                (usuario as any)[update] = req.body[update];
            });
            await usuario.save();

            // Registrar auditoría al actualizar un usuario
            await logAudit(usuario._id.toString(), 'update', `Usuario actualizado: ${usuario.correo}`);

            res.status(200).send(usuario);
        } catch (error) {
            res.status(400).send(error);
        }
    };

    // Eliminar un usuario por ID
    eliminarUsuario = async (req: Request, res: Response) => {
        try {
            const usuario = await Usuario.findByIdAndDelete(req.params.id);
            if (!usuario) {
                return res.status(404).send();
            }
            // Registrar auditoría al eliminar usuario
            await logAudit(usuario._id.toString(), 'delete', `Usuario eliminado: ${usuario.correo}`);

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
