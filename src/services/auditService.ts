import AuditLogModel from '../domain/models/AuditLog';

export const logAudit = async (userId: string, action: string, details: string) => {
    try {
        const logEntry = new AuditLogModel({ userId, action, details });
        await logEntry.save();
    } catch (error) {
        console.error('Error al registrar la auditoría:', error);
    }
};
