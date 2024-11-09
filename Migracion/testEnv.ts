import dotenv from 'dotenv';

dotenv.config();
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
console.log('MYSQL_USER:', process.env.MYSQL_USER);
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD);
console.log('RDS_HOST:', process.env.RDS_HOST);
console.log('RDS_USER:', process.env.RDS_USER);
console.log('RDS_PASSWORD:', process.env.RDS_PASSWORD);
console.log('RDS_DB:', process.env.RDS_DB);
