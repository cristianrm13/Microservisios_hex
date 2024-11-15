import { Document, Schema, model } from 'mongoose';

// Definir la interfaz para el modelo Usuario
export interface IUsuario extends Document {
    nombre: string;
    correo: string;
    contrasena: string;
    telefono: string;
    codigoVerificacion: string;
    role: string; // Nuevo campo para el rol del usuario
}

// Definir el esquema para el modelo Usuario
const usuarioSchema = new Schema<IUsuario>({
    nombre: {
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
        unique: true,
    },
    contrasena: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    codigoVerificacion: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user', // Valor predeterminado para usuarios normales
        enum: ['user', 'admin'], // Restricción de roles posibles
    },
});

// Definir el modelo Usuario
const Usuario = model<IUsuario>('Usuario', usuarioSchema);

export default Usuario;
