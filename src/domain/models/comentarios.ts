import mongoose, { Document, Schema } from 'mongoose';

export interface IComentario extends Document {
    content: string; // Texto del comentario
    userId: mongoose.Schema.Types.ObjectId; // Usuario que realizó el comentario
    quejaId: mongoose.Schema.Types.ObjectId; // Queja asociada al comentario
    dateCreated: Date; // Fecha de creación del comentario
}

const comentarioSchema: Schema = new Schema({
    content: { type: String, required: true, trim: true, maxlength: 500 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    quejaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Queja', required: true },
    dateCreated: { type: Date, default: Date.now },
});

const Comentario = mongoose.model<IComentario>('Comentario', comentarioSchema);

export default Comentario;
