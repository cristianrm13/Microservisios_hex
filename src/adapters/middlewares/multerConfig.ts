/* import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ruta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

//export const upload = multer({ storage });

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        console.log('Tipo MIME recibido:', file.mimetype); // Verifica el tipo MIME
        console.log('Extensión del archivo:', path.extname(file.originalname).toLowerCase());
        
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
    
        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG)'));
        }
    }
    
});
 */


import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ruta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        // Nombre único para el archivo basado en la fecha y el nombre original
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Exporta el middleware multer
export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Aquí no hacemos ninguna validación, se acepta cualquier archivo
        console.log('Tipo MIME recibido:', file.mimetype); // Verifica el tipo MIME
        console.log('Extensión del archivo:', path.extname(file.originalname).toLowerCase());
        
        // Pasar el archivo sin restricciones
        cb(null, true); // Acepta cualquier tipo de archivo
    }
});
