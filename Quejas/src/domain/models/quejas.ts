import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../../Notificaciones/src/infrastructure/database/db';

interface IQuejaAttributes {
    id?: number;
    title: string;
    description: string;
    category: 'Alumbrado' | 'Baches' | 'Limpieza' | 'Seguridad';
    status?: string;
    dateCreated?: Date;
    filePath?: string;
}

// marcar propiedades opcionales usando Partial para el caso de `status` y `dateCreated`
interface IQuejaCreationAttributes extends Optional<IQuejaAttributes, 'id' | 'status' | 'dateCreated'> {}

class Queja extends Model<IQuejaAttributes, IQuejaCreationAttributes> implements IQuejaAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public category!: 'Alumbrado' | 'Baches' | 'Limpieza' | 'Seguridad';
    public status!: string;
    public dateCreated!: Date;
    public filePath?: string; 
}

Queja.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM('Alumbrado', 'Baches', 'Limpieza', 'Seguridad'),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pendiente',
        },
        dateCreated: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'quejas',
        modelName: 'Queja',
        timestamps: false,
    }
);

export default Queja;



/* import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../../Notificaciones/src/infrastructure/database/db';

interface IQuejaAttributes {
    id?: number;
    title: string;
    description: string;
    category: 'Alumbrado' | 'Baches' | 'Limpieza' | 'Seguridad';
    status?: string;
    dateCreated?: Date;
    filePath?: string;
}

// Marcar propiedades opcionales usando Partial para `status` y `dateCreated`
interface IQuejaCreationAttributes extends Optional<IQuejaAttributes, 'id' | 'status' | 'dateCreated'> {}

class Queja extends Model<IQuejaAttributes, IQuejaCreationAttributes> implements IQuejaAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public category!: 'Alumbrado' | 'Baches' | 'Limpieza' | 'Seguridad';
    public status!: string;
    public dateCreated!: Date;
    public filePath?: string; 
}

Queja.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM('Alumbrado', 'Baches', 'Limpieza', 'Seguridad'), // Enum específico para PostgreSQL
            allowNull: false,
            validate: {
                isIn: [['Alumbrado', 'Baches', 'Limpieza', 'Seguridad']],
            },
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pendiente',
        },
        dateCreated: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'quejas',
        modelName: 'Queja',
        timestamps: false,
    }
);

export default Queja;
 */