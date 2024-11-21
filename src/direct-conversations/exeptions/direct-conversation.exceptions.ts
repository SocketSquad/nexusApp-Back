import { HttpException, HttpStatus } from '@nestjs/common';

export class ConversationNotFoundException extends HttpException {
  constructor() {
    super('Conversation not found', HttpStatus.NOT_FOUND);
  }
}

export class ConversationCreationException extends HttpException {
  constructor() {
    super('Failed to create conversation', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class ConversationUpdateException extends HttpException {
  constructor() {
    super('Failed to update conversation', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class ConversationDeletionException extends HttpException {
  constructor() {
    super('Failed to delete conversation', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
