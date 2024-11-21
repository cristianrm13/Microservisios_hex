import mongoose, { Document, Schema } from 'mongoose';

export interface IQuejaHistorico extends Document {
    quejaId: mongoose.Schema.Types.ObjectId; // Relación con la queja
    status: string; // Estado en un momento dado
    timestamp: Date; // Marca de tiempo del cambio
}

const quejaHistoricoSchema: Schema = new Schema({
    quejaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Queja', required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const QuejaHistorico = mongoose.model<IQuejaHistorico>('QuejaHistorico', quejaHistoricoSchema);

export default QuejaHistorico;
