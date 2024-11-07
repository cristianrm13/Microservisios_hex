import { Message } from '../../../../Notificaciones/src/domain/models/message';

export interface MessageRepository {
    sendMessage(message: Message): Promise<void>;
}
