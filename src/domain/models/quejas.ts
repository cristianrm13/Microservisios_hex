import mongoose, { Document, Schema } from 'mongoose';

export interface IQueja extends Document {
    title: string;
    description: string;
    category: 'Alumbrado' | 'Baches' | 'Limpieza' | 'Seguridad';
    status: 'Pendiente' | 'Abierta' | 'No resuelta' | 'Termminada';
    dateCreated: Date;
    userId: mongoose.Schema.Types.ObjectId;
    imageUrl?: string;
    //wordUrl?: string;
}

const quejaSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Alumbrado', 'Baches', 'Limpieza', 'Seguridad'],
    },
    status: { 
        type: String, 
        default: 'Pendiente' ,
        enum: ['Pendiente', 'Abierta', 'No resuelta', 'Termminada'],
    },
    dateCreated: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    imageUrl: { type: String },
    //wordUrl: { type: String },
});

const Queja = mongoose.model<IQueja>('Queja', quejaSchema);

export default Queja;
