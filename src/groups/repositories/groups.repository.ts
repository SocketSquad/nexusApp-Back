import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group } from '../schemas/group.schema';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { UpdatedGroupDto } from '../dtos/update-group.dto';
import { IGroupRepository } from '../interfaces/group.repository.interface';

@Injectable()
export class GroupRepository implements IGroupRepository {
  constructor(@InjectModel(Group.name) private readonly groupModel: Model<Group>) {}

  async create(createGroupDto: CreateGroupDto, ownerId: Types.ObjectId): Promise<Group> {
    const group = new this.groupModel({
      ...createGroupDto,
      owner: ownerId,
      members: [
        {
          userId: ownerId,
          role: 'admin',
          joinedAt: new Date(),
        },
      ],
    });
    return group.save();
  }

  async findAll(filter: any = {}): Promise<Group[]> {
    return this.groupModel.find(filter).populate('owner', 'username email').populate('members.userId', 'username email').exec();
  }

  async findById(id: Types.ObjectId): Promise<Group> {
    return this.groupModel.findById(id).populate('owner', 'username email').populate('members.userId', 'username email').exec();
  }

  async update(id: Types.ObjectId, updateGroupDto: UpdatedGroupDto): Promise<Group> {
    return this.groupModel.findByIdAndUpdate(id, updateGroupDto, { new: true }).exec();
  }

  async delete(id: Types.ObjectId): Promise<Group> {
    return this.groupModel.findByIdAndDelete(id).exec();
  }

  async addMember(groupId: Types.ObjectId, userId: Types.ObjectId, role: string = 'member'): Promise<Group> {
    return this.groupModel
      .findByIdAndUpdate(
        groupId,
        {
          $push: {
            members: {
              userId,
              role,
              joinedAt: new Date(),
            },
          },
          lastActivityAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async removeMember(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<Group> {
    return this.groupModel
      .findByIdAndUpdate(
        groupId,
        {
          $pull: { members: { userId } },
          lastActivityAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async updateMemberRole(groupId: Types.ObjectId, userId: Types.ObjectId, newRole: string): Promise<Group> {
    return this.groupModel
      .findOneAndUpdate(
        {
          _id: groupId,
          'members.userId': userId,
        },
        {
          $set: { 'members.$.role': newRole },
          lastActivityAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async updateLastMessage(
    groupId: Types.ObjectId,
    messageId: Types.ObjectId,
    content: string,
    senderId: Types.ObjectId,
    type: string
  ): Promise<Group> {
    return this.groupModel.findByIdAndUpdate(
      groupId,
      {
        lastMessage: {
          _id: messageId,
          content,
          senderId,
          sentAt: new Date(),
          type,
        },
        lastActivityAt: new Date(),
      },
      { new: true }
    ).exec();
  }

  async updateMemberLastRead(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<Group> {
    return this.groupModel.findOneAndUpdate(
      {
        _id: groupId,
        'members.userId': userId,
      },
      {
        $set: {
          'members.$.lastRead': new Date(),
        },
      },
      { new: true }
    ).exec();
  }
}
