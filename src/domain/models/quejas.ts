import mongoose, { Document, Schema } from 'mongoose';

export interface IQueja extends Document {
    title: string;
    description: string;
    category: 'Alumbrado' | 'Baches' | 'Limpieza' | 'Seguridad';
    status: string;
    dateCreated: Date;
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
});

const Queja = mongoose.model<IQueja>('Queja', quejaSchema);

export default Queja;
