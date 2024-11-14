import { NotFoundException } from '@nestjs/common';

export class FriendRequestNotFoundException extends NotFoundException {
  constructor() {
    super('Friend request not found');
  }
}
