import { Test, TestingModule } from '@nestjs/testing';

import { Types } from 'mongoose';
import { GroupController } from './groups.controller';
import { GroupService } from './providers/groups.service';
import { GroupPrivacy, GroupRole } from '../utils/types';
import { CreateGroupDto } from './dtos/create-group.dto';
import { UpdatedGroupDto } from './dtos/update-group.dto';
import { AddMemberDto } from './dtos/add-member.dto';

describe('GroupController (Integration)', () => {
  let controller: GroupController;
  let service: GroupService;

  const mockGroup = {
    _id: new Types.ObjectId(),
    name: 'Test Group',
    description: 'Test Description',
    privacy: GroupPrivacy.PUBLIC,
    owner: new Types.ObjectId(),
    members: [],
    lastActivityAt: new Date(),
  };

  const mockGroupService = {
    create: jest.fn().mockResolvedValue(mockGroup),
    findAll: jest.fn().mockResolvedValue([mockGroup]),
    findById: jest.fn().mockResolvedValue(mockGroup),
    update: jest.fn().mockResolvedValue(mockGroup),
    delete: jest.fn().mockResolvedValue(mockGroup),
    addMember: jest.fn().mockResolvedValue(mockGroup),
    removeMember: jest.fn().mockResolvedValue(mockGroup),
    updateMemberRole: jest.fn().mockResolvedValue(mockGroup),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        {
          provide: GroupService,
          useValue: mockGroupService,
        },
      ],
    }).compile();

    controller = module.get<GroupController>(GroupController);
    service = module.get<GroupService>(GroupService);
  });

  describe('create', () => {
    it('should create a group', async () => {
      const createGroupDto: CreateGroupDto = {
        name: 'Test Group',
        description: 'Test Description',
        privacy: GroupPrivacy.PUBLIC,
      };
      const userId = new Types.ObjectId().toString();

      const result = await controller.create(createGroupDto, userId);
      
      expect(service.create).toHaveBeenCalledWith(createGroupDto, userId);
      expect(result).toBeDefined();
      expect(result.name).toBe(mockGroup.name);
    });
  });

  describe('findAll', () => {
    it('should return all groups', async () => {
      const result = await controller.findAll(GroupPrivacy.PUBLIC);
      
      expect(service.findAll).toHaveBeenCalledWith(GroupPrivacy.PUBLIC);
      expect(result).toBeInstanceOf(Array);
      expect(result[0].name).toBe(mockGroup.name);
    });
  });

  describe('findOne', () => {
    it('should return a single group', async () => {
      const groupId = mockGroup._id.toString();
      const result = await controller.findOne(groupId);
      
      expect(service.findById).toHaveBeenCalledWith(groupId);
      expect(result).toBeDefined();
      expect(result.name).toBe(mockGroup.name);
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const groupId = mockGroup._id.toString();
      const userId = mockGroup.owner.toString();
      const updateGroupDto: UpdatedGroupDto = {
        name: 'Updated Group Name',
      };

      const result = await controller.update(groupId, updateGroupDto, userId);
      
      expect(service.update).toHaveBeenCalledWith(groupId, updateGroupDto, userId);
      expect(result).toBeDefined();
    });
  });

  describe('addMember', () => {
    it('should add a member to the group', async () => {
      const groupId = mockGroup._id.toString();
      const addMemberDto: AddMemberDto = {
        userId: new Types.ObjectId().toString(),
        role: GroupRole.MEMBER,
      };
      const requesterId = mockGroup.owner.toString();

      const result = await controller.addMember(groupId, addMemberDto, requesterId);
      
      expect(service.addMember).toHaveBeenCalledWith(groupId, addMemberDto, requesterId);
      expect(result).toBeDefined();
    });
  });
});