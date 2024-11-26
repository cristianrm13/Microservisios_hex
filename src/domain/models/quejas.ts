import mongoose, { Document, Schema } from 'mongoose';

// Interface para tipar correctamente el modelo
export interface IQueja extends Document {
    title: string;
    description: string;
    category: 'alumbrado' | 'baches' | 'limpieza' | 'seguridad';
    status: 'pendiente' | 'abierta' | 'no resuelta' | 'terminada';
    dateCreated: Date;
    userId: mongoose.Schema.Types.ObjectId;
    imageUrl?: string;
    comentarios: mongoose.Schema.Types.ObjectId[];
    likes: number;
    usersLiked: mongoose.Schema.Types.ObjectId[];
}

// Definición del esquema de Mongoose
const quejaSchema: Schema = new Schema({
    title: { 
        type: String, 
        required: true,
        trim: true, // Remueve espacios innecesarios
        maxlength: 100 // Límite opcional para el título
    },
    description: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 500 // Límite opcional para la descripción
    },
    category: {
        type: String,
        required: true,
        enum: ['alumbrado', 'baches', 'limpieza', 'seguridad'], // Valores permitidos
    },
    status: { 
        type: String, 
        default: 'pendiente',
        enum: ['pendiente', 'abierta', 'no resuelta', 'terminada'], 
    },
    dateCreated: { 
        type: Date, 
        default: Date.now 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    imageUrl: { 
        type: String, 
        trim: true 
    },
    comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comentario' }],
    likes: { 
        type: Number, 
        default: 0 
    },
    usersLiked: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario' 
    }],
});

// Creación del modelo
const Queja = mongoose.model<IQueja>('Queja', quejaSchema);

export default Queja;
