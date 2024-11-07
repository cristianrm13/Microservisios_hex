import { Message } from '../../../../Notificaciones/src/domain/models/message';
import { MessageRepository } from '../../domain/repositories/messageRepository';

export class SendMessageUseCase {
    constructor(private messageRepository: MessageRepository) { }

    async execute(message: Message): Promise<void> {
        await this.messageRepository.sendMessage(message);
    }
}