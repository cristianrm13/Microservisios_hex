import mongoose, { Document, Schema } from 'mongoose';

export interface IQueja extends Document {
    title: string;
    description: string;
    category: 'Alumbrado' | 'Baches' | 'Limpieza' | 'Seguridad';
    status: string;
    dateCreated: Date;
    userId: mongoose.Schema.Types.ObjectId;
}

const quejaSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Alumbrado', 'Baches', 'Limpieza', 'Seguridad'],
    },
    status: { type: String, default: 'Pendiente' },
    dateCreated: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
});

const Queja = mongoose.model<IQueja>('Queja', quejaSchema);

export default Queja;
