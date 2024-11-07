import axios from 'axios';
import PaymentModel from '../domain/models/pagos';
import { sendWhatsAppMessage } from '../../../Notificaciones/src/services/twilioService';

const DataPhone: { [preferenceId: string]: string } = {}; 

export class MercadoPagoService {
    async createPayment(preferenceData: any) {
        try {
            console.log('Datos recibidos en createPayment:', preferenceData);
            const preferenceResponse = await axios.post('https://api.mercadopago.com/checkout/preferences', preferenceData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
                }
            });
            const linkDePago = preferenceResponse.data.init_point;
            const preferenceId = preferenceResponse.data.id;
            let telefono = preferenceData.payer?.phone?.number;
            console.log('Número de teléfono obtenido:', telefono);
            if (!telefono) {
                throw new Error('Número de teléfono no proporcionado en preferenceData.payer.phone');
            }
            telefono = telefono.startsWith('+') ? telefono : `+${telefono}`;
            DataPhone[preferenceId] = telefono;

            const numeroDestino = `whatsapp:${telefono}`;
            const mensajeWhatsApp = `Tu enlace de pago: ${linkDePago}`;
            await sendWhatsAppMessage(numeroDestino, mensajeWhatsApp);

            return preferenceResponse.data;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error al establecer una preferencia de pago:', error.message);
                throw new Error(`Error al establecer una preferencia de pago: ${error.message}`);
            } else {
                console.error('Error desconocido al establecer una preferencia de pago:', error);
                throw new Error('Error desconocido al establecer una preferencia de pago');
            }
        }
    }

    // Método para procesar las notificaciones del webhook
    async processWebhook(notificacion: any) {
        try {
            if (notificacion.topic === 'merchant_order' && notificacion.resource) {
                const mercadoPagoServiceInstance = new MercadoPagoService();
                const orderDetails = await mercadoPagoServiceInstance.getOrderDetails(notificacion.resource);
                console.log('Detalles de la orden recibidos:', orderDetails);

                // Verificar si la orden contiene información de pagos
                if (orderDetails.payments && orderDetails.payments.length > 0) {
                    const payment = orderDetails.payments[0];

                    // Extraer los detalles del pago
                    const statusDetail = payment.status_detail;
                    const currencyId = payment.currency_id;
                    const paymentId = payment.id;
                    const totalPaidAmount = payment.total_paid_amount;
                    const preferenceId = orderDetails.preference_id;
                    let payerPhone = DataPhone[preferenceId];
                    console.log('Número de teléfono recuperado:', payerPhone);
                    payerPhone = payerPhone.startsWith('+') ? payerPhone : `+${payerPhone}`;

                    if (statusDetail && currencyId && paymentId && totalPaidAmount) {
                        await PaymentModel.create({
                            payment_id: paymentId,
                            status_detail: statusDetail,
                            currency_id: currencyId,
                            total_paid_amount: totalPaidAmount
                        });
                        console.log('Detalles del pago guardados en la base de datos:', {
                            payment_id: paymentId,
                            status_detail: statusDetail,
                            currency_id: currencyId,
                            total_paid_amount: totalPaidAmount
                        });

                        if (payerPhone) {
                            const numeroDestino = `whatsapp:${payerPhone}`;
                            console.log('Enviando mensaje a:', numeroDestino);
                            const mensajeWhatsApp = `Listo *¡Pago Acreditado!*
                            \nTu pago de *${currencyId} ${totalPaidAmount}* ha sido acreditado con éxito.
                            \n*ID de pago:* ${paymentId}`;
                            await sendWhatsAppMessage(numeroDestino, mensajeWhatsApp);
                            console.log('Mensaje de WhatsApp enviado:', payerPhone);
                            delete DataPhone[preferenceId];
                        } else {
                            console.log('No está disponible el número de teléfono para enviar el mensaje de WhatsApp.');
                        }
                    } else {
                        console.log('No se guardaron algunos detalles del pago en la base de datos.');
                    }
                } else {
                    console.log('Los detalles de la orden no incluían información sobre el pago.');
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error al procesar el webhook:', error.message);
            } else {
                console.error('Error desconocido al procesar el webhook:', error);
            }
            throw error;
        }
    }

    async getPayment(paymentId: string) {
        try {
            const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo detalles del pago:', error);
            throw error;
        }
    }

    async getPaymentDetails(paymentId: string) {
        try {
            const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo detalles del pago:', error);
            throw error;
        }
    }

    async getOrderDetails(orderUrl: string) {
        try {
            const response = await axios.get(orderUrl, {
                headers: {
                    'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error obteniendo detalles de la orden: ${orderUrl}`, error);
            throw error;
        }
    }
}
