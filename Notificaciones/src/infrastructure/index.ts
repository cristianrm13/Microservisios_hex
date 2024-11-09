import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from '../adapters/routes/index';
import handleError from '../adapters/middlewares/handleError';
import auditRoutes from '../adapters/routes/auditRoutes';
import { Sequelize } from 'sequelize';
import routes_Users from '../../../Usuarios/src/adapters/routes/index';
import routes_Quejas from '../../../Quejas/src/adapters/routes/index';
import routes_Pagos from '../../../Pagos/src/adapters/routes/index';

dotenv.config();

const app = express();
const port = process.env.PORT || '';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    console.error('ERROR: MERCADO_PAGO_ACCESS_TOKEN no está configurado.');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI || '')
    .then(() => {
        console.log('Conectado a la base de datos MongoDB');
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos MongoDB', error);
    });


const sequelize = new Sequelize(process.env.MYSQL_DB || '', process.env.MYSQL_USER || '', process.env.MYSQL_PASSWORD || '', {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexion con MySQL establecida');
    })
    .catch((error) => {
        console.error('Error de la conexion con MySQL', error);
    });
/*     // Configurar CORS dinamico
const allowedOrigins = ['http://ec2-3-229-227-212.compute-1.amazonaws.com', 'arn:aws:s3:::gladboxbucket'];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
// Aplicar CORS a toda la aplicación
app.use(cors(corsOptions)); */


app.use(cors());
app.use(express.json());

app.use('/api', routes, routes_Users, routes_Quejas, routes_Pagos);

app.use('/api/audit', auditRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

app.use(handleError);

export { app };