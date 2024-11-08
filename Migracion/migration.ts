import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';

dotenv.config({ path: 'C:/Users/luisv/OneDrive/Documentos/9B/Proyecto/MICROSERVICIO/API_microservicios/.env' });

async function exportarBaseDeDatos() {
    try {
        const conexionLocal = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
        });

        const [tablas] = await conexionLocal.query<mysql.RowDataPacket[]>(`SHOW TABLES`);
        let respaldoSQL = '';

        if (Array.isArray(tablas)) {
            for (const fila of tablas) {
                const nombreTabla = fila[`Tables_in_${process.env.MYSQL_DB}`];
                
                const [estructura] = await conexionLocal.query<mysql.RowDataPacket[]>(`SHOW CREATE TABLE \`${nombreTabla}\``);
                // Cambia cualquier campo de tipo 'date' a 'datetime' en la estructura
                respaldoSQL += `${estructura[0]['Create Table'].replace(/ date /g, ' datetime ')};\n\n`;

                const [filas] = await conexionLocal.query<mysql.RowDataPacket[]>(`SELECT * FROM \`${nombreTabla}\``);
                filas.forEach((fila) => {
                    const valores = Object.values(fila).map((val) => {
                        if (val instanceof Date) {
                            return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
                        }
                        return typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` : val;
                    });
                    respaldoSQL += `INSERT INTO \`${nombreTabla}\` VALUES (${valores.join(', ')});\n`;
                });
                respaldoSQL += `\n\n`;
            }

            fs.writeFileSync('respaldo.sql', respaldoSQL);
            console.log('Base de datos exportada a respaldo.sql');
        } else {
            console.error('Error: no se obtuvo una lista de tablas');
        }

        await conexionLocal.end();
    } catch (error) {
        console.error('Error al exportar la base de datos:', error);
    }
}

async function importarBaseDeDatos() {
    try {
        const conexionRDS = await mysql.createConnection({
            host: process.env.RDS_HOST,
            user: process.env.RDS_USER,
            password: process.env.RDS_PASSWORD,
            database: process.env.RDS_DB,
        });

        const respaldoSQL = fs.readFileSync('respaldo.sql', 'utf8');
        const statements = respaldoSQL.split(';');

        for (const statement of statements) {
            if (statement.trim()) {
                console.log('Ejecutando:', statement + ';');
                await conexionRDS.query(statement + ';');
            }
        }

        console.log('Datos importados exitosamente a Amazon RDS');
        await conexionRDS.end();
    } catch (error) {
        console.error('Error al importar la base de datos:', error);
    }
}

(async () => {
    await exportarBaseDeDatos();
    await importarBaseDeDatos();
})();
