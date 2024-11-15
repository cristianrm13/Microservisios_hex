import { Request, Response } from 'express';
import Queja, { IQueja } from '../../domain/models/quejas';
import fs from 'fs';
import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, Packer } from "docx";


export class QuejaController {
    constructor() { }

    // Crear una nueva queja
    crearQueja = async (req: Request, res: Response) => {
        try {
            const { title, description, category } = req.body;
            const userId = (req as any).userId;

           // const userId = req.params.id;
            const filePath = req.file?.path; // Obtener la ruta del archivo

            const queja = new Queja({ title, description, category, filePath, userId });
            await queja.save();
            // Generar Word
            await this.generarWord(queja);
            res.status(201).send(queja);
        } catch (error) {
            console.error('Error al crear la queja:', error);
            res.status(500).send({ error: 'Error al crear la queja.' });
        }
    };

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
            await queja.save();
            res.status(200).send(queja);
        } catch (error) {
            res.status(400).send(error);
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
export const actualizarQueja = new QuejaController().actualizarQueja;
export const eliminarQueja = new QuejaController().eliminarQueja;
