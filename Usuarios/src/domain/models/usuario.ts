import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../../Notificaciones/src/infrastructure/database/db';


export interface IUsuario {
    id?: number;
    nombre: string;
    correo: string;
    contrasena: string;
    telefono: string;
    codigo_verificacion: string;
    fecha_operacion	?: Date;
}


class Usuario extends Model<IUsuario> implements IUsuario {
    static findById(_id: string) {
        throw new Error('Method not implemented.');
    }
    static find(arg0: {}) {
        throw new Error('Method not implemented.');
    }
    public id!: number;
    public nombre!: string;
    public correo!: string;
    public contrasena!: string;
    public telefono!: string;
    public codigo_verificacion!: string;
    public fecha_operacion	!: Date;
}


Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        contrasena: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        codigo_verificacion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fecha_operacion	: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'usuarios',
        modelName: 'Usuario',
        timestamps: false,
    }
);

export default Usuario;