import mongoose, { Document, Schema } from 'mongoose';

interface AuditLog extends Document {
    userId: string; // ID del usuario que realiza la acción
    action: string; // Tipo de acción (e.g., 'login', 'create', 'update', 'delete')
    timestamp: Date; // Fecha y hora de la acción
    details: string; // Detalles adicionales sobre la acción
}

const AuditLogSchema: Schema = new Schema({
    userId: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: String, required: true },
});

const AuditLogModel = mongoose.model<AuditLog>('AuditLog', AuditLogSchema);

export default AuditLogModel;
