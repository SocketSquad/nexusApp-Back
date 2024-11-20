import { BadRequestException, NotFoundException, UnauthorizedException, InternalServerErrorException, HttpException } from '@nestjs/common';

export class DirectMessageExceptions {
  static handleCreateError(error: any): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    if (error.name === 'ValidationError') {
      return new BadRequestException({
        message: 'Invalid message content',
        details: error.errors,
      });
    }

    if (error.code === 11000) {
      return new BadRequestException('Duplicate message detected');
    }

    return new InternalServerErrorException('Error creating message');
  }

  static handleQueryError(error: any): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    if (error.name === 'CastError') {
      return new BadRequestException('Invalid ID format');
    }

    if (error.message.includes('not found')) {
      return new NotFoundException('Message not found');
    }

    return new InternalServerErrorException('Error querying messages');
  }

  static handleUpdateError(error: any): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    if (error.name === 'ValidationError') {
      return new BadRequestException({
        message: 'Invalid message content',
        details: error.errors,
      });
    }

    if (error.message.includes('unauthorized')) {
      return new UnauthorizedException('You are not authorized to update this message');
    }

    return new InternalServerErrorException('Error updating message');
  }

  static handleDeleteError(error: any): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    if (error.message.includes('unauthorized')) {
      return new UnauthorizedException('You are not authorized to delete this message');
    }

    if (error.message.includes('not found')) {
      return new NotFoundException('Message not found');
    }

    return new InternalServerErrorException('Error deleting message');
  }
}
