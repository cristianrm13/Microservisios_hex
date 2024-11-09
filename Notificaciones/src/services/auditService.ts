import AuditLogModel from '../domain/models/AuditLog';

export const logAudit = async (userId: string, action: string, details: string) => {
    // Validación de datos
    if (!userId || !action || !details) {
        console.error('Error al registrar la auditoría: Datos insuficientes.', { userId, action, details });
        return; // Termina la función si los datos son inválidos
    }

    try {
        // Crear una nueva entrada de auditoría
        const logEntry = new AuditLogModel({ userId, action, details });
        await logEntry.save();
        console.log('Registro de auditoría guardado:', logEntry);
    } catch (error) {
        console.error('Error al registrar la auditoría:', error);
    }
};
