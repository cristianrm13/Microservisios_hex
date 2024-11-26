import { Request, Response } from 'express';
import Queja, { IQueja } from '../../domain/models/quejas';
import fs from 'fs';
import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, Packer } from "docx";
import nodemailer from 'nodemailer';
import QuejaHistorico from '../../domain/models/serieTiempo';
import { ObjectId } from 'mongodb';
import cloudinary from '../../infrastructure/cloudinaryConfig';

export class QuejaController {
    constructor() { }

    // Crear una nueva queja
    crearQueja = async (req: Request, res: Response) => {
        try {
            const { title, description, category } = req.body;
            const userId = (req as any).userId;

            let imageUrl = '';

            if (req.file?.path) {
                // Subir archivo a Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'quejas',
                });
                imageUrl = result.secure_url;

                // Elimina el archivo local después de subirlo
                fs.unlinkSync(req.file.path);
            }

            const queja = new Queja({ title, description, category, imageUrl, userId });
            await queja.save();

            // Generar Word
            await this.generarWord(queja);
            // Enviar el archivo Word por correo
            await this.enviarCorreoConAdjunto(queja);
            res.status(201).send(queja);


        } catch (error) {
            console.error('Error al crear la queja:', error);
            res.status(500).send({ error: 'Error al crear la queja.' });
        }

    };

    private async enviarCorreoConAdjunto(queja: IQueja) {
        const categoriasPorCorreo: Record<string, string[]> = {
            'cristianrmartist@gmail.com': ['alumbrado'],
            '221267@ids.upchiapas.edu.mx': ['limpieza'],
            'cristiangv1313@gmail.com': ['baches'],
            'perrera@example.com': ['seguridad'],
            'bomber@example.com': ['alumbrado', 'seguridad'],
        };

        const categorias = Array.isArray(queja.category) ? queja.category : [queja.category];

        // Encontrar todos los destinatarios correspondientes a las categorías
        const destinatarios = Object.keys(categoriasPorCorreo).filter((correo) =>
            categorias.some((categoria) => categoriasPorCorreo[correo].includes(categoria))
        );

        if (destinatarios.length === 0) {
            console.error(`No se encontró correo para las categorías: ${categorias.join(', ')}`);
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '221267@ids.upchiapas.edu.mx',
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Configurar y enviar correos
        for (const destinatario of destinatarios) {
            const mailOptions = {
                from: '221267@ids.upchiapas.edu.mx',
                to: destinatario,
                subject: `Nueva queja registrada: ${queja.title}`,
                text: `Se ha registrado una nueva queja en GladBox.\n\nTítulo: ${queja.title}\nEstado: ${queja.status}\nFecha: ${queja.dateCreated.toLocaleDateString('es-ES')}`,
                attachments: [
                    {
                        filename: `queja_${queja._id}.docx`,
                        path: `./reportes/queja_${queja._id}.docx`,
                    },
                ],
            };

            try {
                const emailResponse = await transporter.sendMail(mailOptions);
                console.log(`Correo enviado exitosamente a: ${destinatario}`, emailResponse);
            } catch (error) {
                console.error(`Error al enviar correo a: ${destinatario}`, error);
            }
        }
    }

    //generar un archivo Word
    private async generarWord(queja: IQueja) {
        const doc = new Document({
            sections: [
                {
                    children: [
                        // Portada
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: "GladBox - Reporte",
                                    bold: true,
                                    size: 48,
                                    color: "000000",
                                    font: "Calibri",
                                }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: `Fecha: ${queja.dateCreated.toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}`,
                                    italics: true,
                                    size: 24,
                                    color: "333333",
                                    font: "Calibri",
                                }),
                            ],
                        }),

                        // Resumen
                        new Paragraph({
                            text: "Resumen",
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.LEFT,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Este reporte describe los detalles y el estado actual de la queja titulada "${queja.title}". El reporte se genera con el fin de documentar y realizar un seguimiento efectivo de las quejas registradas en el sistema.`,
                                    size: 24,
                                    font: "Calibri",
                                }),
                            ],
                            spacing: { after: 200 },
                        }),

                        // Detalles de la Queja
                        new Paragraph({
                            text: "Detalles de la Queja",
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.LEFT,
                            spacing: { after: 300 },
                        }),

                        // Tabla para detalles de la queja
                        new Table({
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph("Título")],
                                            width: { size: 30, type: WidthType.PERCENTAGE },
                                            borders: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },

                                        }),
                                        new TableCell({
                                            children: [new Paragraph(queja.title)],
                                            width: { size: 50, type: WidthType.PERCENTAGE },
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph("Descripción")],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(queja.description)],
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph("Categoría")],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(queja.category)],
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph("Estado")],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(queja.status)],

                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph("Fecha de creación")],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(queja.dateCreated.toLocaleString())],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                },
            ],
        });

        // Guardar el archivo Word
        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(`./reportes/queja_${queja._id}.docx`, buffer);
    }

    // Obtener todas las quejas
    obtenerQuejas = async (req: Request, res: Response) => {
        try {
            const quejas = await Queja.find({});
            res.status(200).send(quejas);
        } catch (error) {
            res.status(500).send({ error: 'Error al obtener las quejas.' });
        }
    };

    // Obtener las quejas de un usuario específico
    obtenerQuejasPorUsuario = async (req: Request, res: Response) => {
        const userId = req.params.id; // ID del usuario en el parámetro de la URL
        try {
            const quejas = await Queja.find({ userId });
            res.status(200).send(quejas);
        } catch (error) {
            console.error('Error al obtener las quejas del usuario:', error);
            res.status(500).send({ error: 'Error al obtener las quejas del usuario.' });
        }
    };

    // Obtener una queja por ID
    obtenerQuejaPorId = async (req: Request, res: Response) => {
        const _id = req.params.id;
        try {
            const queja = await Queja.findById(_id);
            if (!queja) {
                return res.status(404).send({ error: 'Queja no encontrada.' });
            }
            res.status(200).send(queja);
        } catch (error) {
            res.status(500).send({ error: 'Error al obtener la queja.' });
        }
    };

    // Obtener quejas por categoría
    obtenerQuejasPorCategoria = async (req: Request, res: Response) => {
        const { category } = req.params; // Obtener la categoría de los parámetros de la URL

        try {
            const quejas = await Queja.find({ category });
            if (quejas.length === 0) {
                return res.status(404).send({ error: 'No se encontraron quejas para esta categoría.' });
            }
            res.status(200).send(quejas);
        } catch (error) {
            console.error('Error al obtener quejas por categoría:', error);
            res.status(500).send({ error: 'Error al obtener quejas por categoría.' });
        }
    };

    obtenerQuejasPorCategoriaAgrupadas = async (req: Request, res: Response) => {
        try {
            const quejasAgrupadas = await Queja.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $sort: { count: -1 } }, // Ordenar por cantidad descendente
            ]);
            res.status(200).send(quejasAgrupadas);
        } catch (error) {
            console.error('Error al agrupar quejas por categoría:', error);
            res.status(500).send({ error: 'Error al agrupar quejas por categoría.' });
        }
    };

    obtenerQuejasPorEstadoAgrupadas = async (req: Request, res: Response) => {
        try {
            const quejasAgrupadas = await Queja.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]);
            res.status(200).send(quejasAgrupadas);
        } catch (error) {
            console.error('Error al agrupar quejas por estado:', error);
            res.status(500).send({ error: 'Error al agrupar quejas por estado.' });
        }
    };

    obtenerQuejasPorFecha = async (req: Request, res: Response) => {
        try {
            const quejasPorFecha = await Queja.aggregate([
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateCreated" } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } } // Ordenar por fecha ascendente
            ]);
            res.status(200).send(quejasPorFecha);
        } catch (error) {
            console.error('Error al agrupar quejas por fecha:', error);
            res.status(500).send({ error: 'Error al agrupar quejas por fecha.' });
        }
    };

    obtenerUsuariosConMasQuejas = async (req: Request, res: Response) => {
        try {
            const usuariosConMasQuejas = await Queja.aggregate([
                // Agrupamos por userId y contamos la cantidad de quejas
                {
                    $group: {
                        _id: "$userId",
                        count: { $sum: 1 }
                    }
                },
                // Ordenamos en orden descendente por cantidad
                { $sort: { count: -1 } },
                // Limitamos a los 10 usuarios más activos
                { $limit: 10 },
                // Hacemos un lookup para obtener los datos del usuario
                {
                    $lookup: {
                        from: "usuarios", // Nombre de la colección de usuarios
                        localField: "_id", // Campo en esta colección que queremos unir
                        foreignField: "_id", // Campo de la colección Usuarios que coincide
                        as: "usuario" // Nombre del campo donde se almacenarán los datos del usuario
                    }
                },
                // Desestructuramos el array resultante de "usuario" para obtener un solo documento
                {
                    $unwind: "$usuario"
                },
                // Seleccionamos los campos que queremos devolver
                {
                    $project: {
                        _id: 0, // Ocultamos el ID original si no es necesario
                        userId: "$_id",
                        count: 1,
                        nombre: "$usuario.nombre", // Asumimos que el nombre del usuario está en el campo 'name'
                        email: "$usuario.correo" // Si deseas incluir el email también
                    }
                }
            ]);
            res.status(200).send(usuariosConMasQuejas);
        } catch (error) {
            console.error('Error al obtener usuarios con más quejas:', error);
            res.status(500).send({ error: 'Error al obtener usuarios con más quejas.' });
        }
    };

    obtenerQuejasPorMes = async (req: Request, res: Response) => {
        try {
            const quejasPorMes = await Queja.aggregate([
                {
                    $group: {
                        _id: {
                            año: { $year: "$fechaCreacion" },
                            mes: { $month: "$fechaCreacion" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.año": 1, "_id.mes": 1 } } // Ordenar cronológicamente
            ]);
            res.status(200).send(quejasPorMes);
        } catch (error) {
            console.error('Error al obtener quejas por mes:', error);
            res.status(500).send({ error: 'Error al obtener quejas por mes.' });
        }
    };

    obtenerPorcentajeResueltas = async (req: Request, res: Response) => {
        try {
            const porcentajes = await Queja.aggregate([
                {
                    $group: {
                        _id: "$status", // Por estado (resuelta/no resuelta)
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        status: "$_id",
                        count: 1,
                        porcentaje: {
                            $multiply: [{ $divide: ["$count", { $sum: "$count" }] }, 100]
                        }
                    }
                }
            ]);
            res.status(200).send(porcentajes);
        } catch (error) {
            console.error('Error al obtener el porcentaje de quejas resueltas:', error);
            res.status(500).send({ error: 'Error al obtener el porcentaje de quejas resueltas.' });
        }
    };

    obtenerCategoriaMasFrecuente = async (req: Request, res: Response) => {
        try {
            const categoriaMasFrecuente = await Queja.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } }, // Contar por categoría
                { $sort: { count: -1 } }, // Ordenar en orden descendente
                { $limit: 2 } // Tomar la categoría con más ocurrencias
            ]);
            res.status(200).send(categoriaMasFrecuente);
        } catch (error) {
            console.error('Error al obtener la categoría más frecuente:', error);
            res.status(500).send({ error: 'Error al obtener la categoría más frecuente.' });
        }
    };

    obtenerHistorialQueja = async (req: Request, res: Response) => {
        const quejaId = req.params.id;
        try {
            const historicos = await QuejaHistorico.find({ quejaId: new ObjectId(quejaId) }).exec();

            if (!historicos || historicos.length === 0) {
                return res.status(404).json({ error: 'No se encontraron registros históricos para esta queja.' });
            }

            res.status(200).send(historicos);
        } catch (error) {
            console.error(`Error al obtener el historial de la queja con ID: ${quejaId}`, error);
            res.status(500).send({ error: 'Error al obtener el historial de la queja.' });
        }
    };



    // Actualizar una queja por ID
    /*     actualizarQueja = async (req: Request, res: Response) => {
            const updates = Object.keys(req.body) as Array<keyof IQueja>;
            const allowedUpdates: Array<keyof IQueja> = ['title', 'description', 'category', 'status'];
            const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
            if (!isValidOperation) {
                return res.status(400).send({ error: 'Actualización no permitida' });
            }
    
            try {
                const queja = await Queja.findById(req.params.id);
                if (!queja) {
                    return res.status(404).send({ error: 'Queja no encontrada.' });
                }
    
                updates.forEach((update) => {
                    (queja as any)[update] = req.body[update];
                });
                await queja.save();
                res.status(200).send(queja);
            } catch (error) {
                res.status(400).send(error);
            }
        };
     */

    // Actualizar una queja por ID
    actualizarQueja = async (req: Request, res: Response) => {
        const updates = Object.keys(req.body) as Array<keyof IQueja>;
        const allowedUpdates: Array<keyof IQueja> = ['title', 'description', 'category', 'status'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Actualización no permitida' });
        }

        try {
            const queja = await Queja.findById(req.params.id);
            if (!queja) {
                return res.status(404).send({ error: 'Queja no encontrada.' });
            }

            updates.forEach((update) => {
                (queja as any)[update] = req.body[update];
            });

            // Registrar cambio de estado en el historial
            if (req.body.status && req.body.status !== queja.status) {
                const historico = new QuejaHistorico({
                    quejaId: queja._id,
                    status: req.body.status,
                    usuarioId: (req as any).userId,  // Asumimos que el usuario está en `req.userId`
                    timestamp: new Date(),
                    descripcion: `Estado cambiado de "${queja.status}" a "${req.body.status}"`,
                });

                try {
                    await historico.save();
                    console.log('Registro histórico guardado:', historico);
                } catch (error) {
                    console.error('Error al guardar registro histórico:', error);
                }
            }


            await queja.save();
            res.status(200).send(queja);
        } catch (error) {
            res.status(400).send(error);
        }
    };

    darLike = async (req: Request, res: Response) => {
        const quejaId = req.params.id;
        const userId = (req as any).userId;
    
        try {
            // Buscar la queja por ID
            const queja = await Queja.findById(quejaId);
            if (!queja) {
                return res.status(404).json({ message: 'Queja no encontrada' });
            }
    
            // Verificar si el usuario ya ha dado like
            if (queja.usersLiked.includes(userId)) {
                return res.status(400).json({ message: 'Ya has dado like a esta queja' });
            }
    
            // Agregar el like
            queja.likes += 1;
            queja.usersLiked.push(userId);
    
            // Guardar los cambios en la base de datos
            await queja.save();
    
            res.status(200).json({
                message: 'Like registrado correctamente',
                likes: queja.likes,
            });
        } catch (error) {
            console.error('Error al dar like:', error);
            res.status(500).json({ message: 'Error al dar like', error });
        }
    };

    // Eliminar una queja por ID
    eliminarQueja = async (req: Request, res: Response) => {
        try {
            const queja = await Queja.findByIdAndDelete(req.params.id);
            if (!queja) {
                return res.status(404).send({ error: 'Queja no encontrada.' });
            }
            res.status(200).send(queja);
        } catch (error) {
            res.status(500).send(error);
        }
    };
}




// Exporta las instancias del controlador
export const crearQueja = new QuejaController().crearQueja;
export const obtenerQuejas = new QuejaController().obtenerQuejas;
export const obtenerQuejaPorId = new QuejaController().obtenerQuejaPorId;
export const obtenerQuejasPorCategoria = new QuejaController().obtenerQuejasPorCategoria;
export const obtenerQuejasPorCategoriaAgrupadas = new QuejaController().obtenerQuejasPorCategoriaAgrupadas;
export const obtenerQuejasPorEstadoAgrupadas = new QuejaController().obtenerQuejasPorEstadoAgrupadas;
export const obtenerQuejasPorFecha = new QuejaController().obtenerQuejasPorFecha;
export const obtenerUsuariosConMasQuejas = new QuejaController().obtenerUsuariosConMasQuejas;
export const obtenerQuejasPorMes = new QuejaController().obtenerQuejasPorMes;
export const obtenerPorcentajeResueltas = new QuejaController().obtenerPorcentajeResueltas;
export const obtenerCategoriaMasFrecuente = new QuejaController().obtenerCategoriaMasFrecuente;
export const obtenerHistorialQueja = new QuejaController().obtenerHistorialQueja;


export const actualizarQueja = new QuejaController().actualizarQueja;
export const eliminarQueja = new QuejaController().eliminarQueja;
export const darLike = new QuejaController().darLike;
