import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';
import { GroupService } from './groups.service';
import { GroupRepository } from '../repositories/groups.repository';
import { GroupPrivacy, GroupRole } from '@/utils/types';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { UpdatedGroupDto } from '../dtos/update-group.dto';
import { AddMemberDto } from '../dtos/add-member.dto';

describe('GroupService (Unit)', () => {
  let service: GroupService;
  let repository: GroupRepository;

  const mockGroup = {
    _id: new Types.ObjectId(),
    name: 'Test Group',
    description: 'Test Description',
    privacy: GroupPrivacy.PUBLIC,
    owner: { _id: new Types.ObjectId() },
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
      const userId = new Types.ObjectId();

      const result = await service.create(createGroupDto, userId);

      expect(repository.create).toHaveBeenCalledWith(createGroupDto, userId);
      expect(result).toEqual(mockGroup);
    });
  });

  describe('findById', () => {
    it('should find a group by id', async () => {
      const groupId = mockGroup._id.toString();
      const result = await service.findById(groupId);

      expect(repository.findById).toHaveBeenCalledWith(new Types.ObjectId(groupId));
      expect(result).toEqual(mockGroup);
    });

    it('should throw NotFoundException when group not found', async () => {
      const groupId = new Types.ObjectId().toString();
      mockGroupRepository.findById.mockResolvedValueOnce(null);

      await expect(service.findById(groupId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a group when user is owner', async () => {
      const groupId = mockGroup._id.toString();
      const updateGroupDto: UpdatedGroupDto = { name: 'Updated Name' };
      const userId = mockGroup.owner._id;

      const result = await service.update(groupId, updateGroupDto, userId);

      expect(repository.update).toHaveBeenCalledWith(
        new Types.ObjectId(groupId),
        updateGroupDto
      );
      expect(result).toEqual(mockGroup);
    });

    it('should throw ForbiddenException when user is not owner', async () => {
      const groupId = mockGroup._id.toString();
      const updateGroupDto: UpdatedGroupDto = { name: 'Updated Name' };
      const userId = new Types.ObjectId();

      await expect(
        service.update(groupId, updateGroupDto, userId)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('addMember', () => {
    it('should add member when requester is admin', async () => {
      const groupId = mockGroup._id.toString();
      const newMemberId = new Types.ObjectId();
      const requesterId = mockGroup.owner._id;
      
      const addMemberDto: AddMemberDto = {
        userId: newMemberId,
        role: GroupRole.MEMBER,
      };
      
      mockGroupRepository.findById.mockResolvedValueOnce({
        ...mockGroup,
        members: [{ userId: requesterId, role: 'admin' }],
      });

      const result = await service.addMember(
        groupId,
        addMemberDto,
        requesterId
      );

      expect(repository.addMember).toHaveBeenCalledWith(
        new Types.ObjectId(groupId),
        addMemberDto.userId,
        GroupRole.MEMBER
      );
      expect(result).toEqual(mockGroup);
    });

    it('should throw ForbiddenException when member already exists', async () => {
      const groupId = mockGroup._id.toString();
      const memberId = new Types.ObjectId();
      const requesterId = mockGroup.owner._id;

      const addMemberDto: AddMemberDto = {
        userId: memberId,
        role: GroupRole.MEMBER,
      };

      mockGroupRepository.findById.mockResolvedValueOnce({
        ...mockGroup,
        members: [
          { userId: requesterId, role: 'admin' },
          { userId: memberId, role: 'member' },
        ],
      });

      await expect(
        service.addMember(
          groupId,
          addMemberDto,
          requesterId
        )
      ).rejects.toThrow(ForbiddenException);
    });
  });
});