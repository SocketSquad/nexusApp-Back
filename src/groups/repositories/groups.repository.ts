import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group } from '../schemas/group.schema';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { UpdatedGroupDto } from '../dtos/update-group.dto';
import { IGroupRepository } from '../interfaces/group.repository.interface';


@Injectable()
export class GroupRepository implements IGroupRepository {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>
  ) {}

  async create(createGroupDto: CreateGroupDto, ownerId: string): Promise<Group> {
    const group = new this.groupModel({
      ...createGroupDto,
      owner: new Types.ObjectId(ownerId),
      members: [{ userId: new Types.ObjectId(ownerId), role: 'admin', joinedAt: new Date() }],
    });
    return group.save();
  }

  async findAll(filter: any = {}): Promise<Group[]> {
    return this.groupModel
      .find(filter)
      .populate('owner', 'username email')
      .populate('members.userId', 'username email')
      .exec();
  }

  async findById(id: string): Promise<Group> {
    return this.groupModel
      .findById(id)
      .populate('owner', 'username email')
      .populate('members.userId', 'username email')
      .exec();
  }

  async update(id: string, updateGroupDto: UpdatedGroupDto): Promise<Group> {
    return this.groupModel
      .findByIdAndUpdate(id, updateGroupDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Group> {
    return this.groupModel.findByIdAndDelete(id).exec();
  }

  async addMember(groupId: string, userId: string, role: string = 'member'): Promise<Group> {
    return this.groupModel.findByIdAndUpdate(
      groupId,
      {
        $push: {
          members: {
            userId: new Types.ObjectId(userId),
            role,
            joinedAt: new Date(),
          },
        },
        lastActivityAt: new Date(),
      },
      { new: true }
    ).exec();
  }

  async removeMember(groupId: string, userId: string): Promise<Group> {
    return this.groupModel.findByIdAndUpdate(
      groupId,
      {
        $pull: { members: { userId: new Types.ObjectId(userId) } },
        lastActivityAt: new Date(),
      },
      { new: true }
    ).exec();
  }

  async updateMemberRole(groupId: string, userId: string, newRole: string): Promise<Group> {
    return this.groupModel.findOneAndUpdate(
      {
        _id: groupId,
        'members.userId': new Types.ObjectId(userId),
      },
      {
        $set: { 'members.$.role': newRole },
        lastActivityAt: new Date(),
      },
      { new: true }
    ).exec();
  }
}