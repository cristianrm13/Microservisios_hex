import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from '../adapters/routes/index';
import handleError from '../adapters/middlewares/handleError';
import auditRoutes from '../adapters/routes/auditRoutes';
import sanitizeInputs from '../adapters/middlewares/sanitizeInputs';
import { blacklistMiddleware } from '../adapters/middlewares/blacklistMiddleware';
import { cleanInput } from '../adapters/middlewares/cleanInput';
//import comentariosRoutes from '../adapters/routes/comentariosRoutes';
dotenv.config();

const app = express();
const port = process.env.PORT || 3029;

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

// Configurar CORS dinamico
/* const allowedOrigins = ['http://ec2-3-229-227-212.compute-1.amazonaws.com', 'https://console.cloudinary.com/pm/c-ab27c215fed10a66a18d10b089aa1e/media-explorer/'];

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
app.use(sanitizeInputs);
app.use(blacklistMiddleware);
app.use(cleanInput);

app.use('/api', routes);
app.use('/api/audit', auditRoutes);
//app.use('/api/comentarios', comentariosRoutes);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use(handleError);

export { app };