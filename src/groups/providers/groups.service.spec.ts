import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException, ForbiddenException } from '@nestjs/common';

import { Types } from 'mongoose';
import { GroupService } from './groups.service';
import { GroupRepository } from '../repositories/groups.repository';
import { GroupPrivacy, GroupRole } from '@/utils/types';
import { CreateGroupDto } from '../dtos/create-group.dto';

describe('GroupService (Unit)', () => {
  let service: GroupService;
  let repository: GroupRepository;

  const mockGroup = {
    _id: new Types.ObjectId(),
    name: 'Test Group',
    description: 'Test Description',
    privacy: GroupPrivacy.PUBLIC,
    owner: new Types.ObjectId(),
    members: [],
    lastActivityAt: new Date(),
  };

  const mockGroupRepository = {
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
      providers: [
        GroupService,
        {
          provide: GroupRepository,
          useValue: mockGroupRepository,
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    repository = module.get<GroupRepository>(GroupRepository);
  });

  describe('create', () => {
    it('should create a group successfully', async () => {
      const createGroupDto: CreateGroupDto = {
        name: 'Test Group',
        description: 'Test Description',
        privacy: GroupPrivacy.PUBLIC,
      };
      const userId = new Types.ObjectId().toString();

      const result = await service.create(createGroupDto, userId);

      expect(repository.create).toHaveBeenCalledWith(createGroupDto, userId);
      expect(result).toEqual(mockGroup);
    });
  });

  describe('findById', () => {
    it('should find a group by id', async () => {
      const groupId = mockGroup._id.toString();
      const result = await service.findById(groupId);

      expect(repository.findById).toHaveBeenCalledWith(groupId);
      expect(result).toEqual(mockGroup);
    });

    it('should throw NotFoundException when group not found', async () => {
      const groupId = new Types.ObjectId().toString();
      mockGroupRepository.findById.mockResolvedValueOnce(null);

      await expect(service.findById(groupId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addMember', () => {
    it('should throw ForbiddenException when requester is not admin', async () => {
      const groupId = mockGroup._id.toString();
      const userId = new Types.ObjectId().toString();
      const requesterId = new Types.ObjectId().toString();

      mockGroupRepository.findById.mockResolvedValueOnce({
        ...mockGroup,
        members: [{ userId: requesterId, role: 'member' }],
      });

      await expect(service.addMember(groupId, { userId, role: GroupRole.MEMBER }, requesterId)).rejects.toThrow(ForbiddenException);
    });
  });
});
