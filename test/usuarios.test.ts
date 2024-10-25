import request from 'supertest';

import { app } from '../src/infrastructure/index';
import mongoose from 'mongoose';
//import { sendWhatsAppMessage } from '../src/services/twilioService';

// Mockear nodemailer para evitar envío de correos reales
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      response: '250 OK: Message accepted',
    }),
  }),
}));

// Mockear el servicio de Twilio
jest.mock('../src/services/twilioService', () => ({
  sendWhatsAppMessage: jest.fn(),
}));

describe('Pruebas de integración de usuario', () => {

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) { // 0 significa que no hay conexión
      await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/testdb');
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('Debería crear un nuevo usuario', async () => {
    const nuevoUsuario = {
      nombre: 'Cristian',
      correo: 'cristian@gmail.com',
      contrasena: 'password123',
      telefono: '1234567890'
    };

    // Prueba de integración del endpoint de creación de usuario
    const response = await request(app)
      .post('/api/v1/usuarios')
      .send(nuevoUsuario);

    // Verificamos que la respuesta sea 201 (creado exitosamente)
    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe(nuevoUsuario.nombre);
    expect(response.body.token).toBeDefined(); // Verificar que se genera un token JWT

    // Verificamos que Nodemailer fue llamado correctamente
    const nodemailer = require('nodemailer');
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(1);
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: nuevoUsuario.correo,
      subject: '¡Bienvenido a nuestra plataforma!',
    }));
  });

  /*   describe('Enviar WhatsApp', () => {
      it('debería enviar un mensaje de WhatsApp con éxito', async () => {
          const messageData = {
              to: '+9651248795',
              body: 'Hola, este es un mensaje de prueba',
          };
  
          (sendWhatsAppMessage as jest.Mock).mockResolvedValue({
              success: true,
              messageId: 'SM12345',
          });
  
          const response = await request(app)
              .post('/api/v1/whatsapp') // Asegúrate de que esta ruta esté definida en tu servidor
              .send(messageData);
  
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject({
            success: true,
            messageId: 'SM12345',
            message: expect.any(String),
          });
      });
  
      it('debería devolver un error si faltan datos del mensaje', async () => {
          const messageData = {
              to: '+9651248795',
          };
  
          const response = await request(app)
              .post('/api/v1/whatsapp')
              .send(messageData);
  
          expect(response.status).toBe(400);
          expect(response.body.message).toBe('El cuerpo del mensaje es obligatorio');
      });
  }); */
});
