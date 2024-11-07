import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../infrastructure/database/db';

interface IAuditLogAttributes {
    id?: number;
    userId: string;
    action: string;
    timestamp?: Date;
    details: string;
}

// Hacemos que `id` y `timestamp` sean opcionales en la creación del registro.
interface IAuditLogCreationAttributes extends Optional<IAuditLogAttributes, 'id' | 'timestamp'> {}

class AuditLog extends Model<IAuditLogAttributes, IAuditLogCreationAttributes> implements IAuditLogAttributes {
    public id!: number;
    public userId!: string;
    public action!: string;
    public timestamp!: Date;
    public details!: string;
}

AuditLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        details: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'audit_logs',
        modelName: 'AuditLog',
        timestamps: false,
    }
);

export default AuditLog;
