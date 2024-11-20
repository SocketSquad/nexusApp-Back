import { Test, TestingModule } from '@nestjs/testing';

import { Types } from 'mongoose';

import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GroupPrivacy, GroupRole, MessageType } from '@/utils/types';
import { GroupService } from './groups.service';
import { GroupRepository } from '../repositories/groups.repository';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { UpdatedGroupDto } from '../dtos/update-group.dto';
import { AddMemberDto } from '../dtos/add-member.dto';

describe('GroupService', () => {
  let service: GroupService;
  let repository: GroupRepository;

  const mockGroupRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addMember: jest.fn(),
    removeMember: jest.fn(),
    updateMemberRole: jest.fn(),
    updateLastMessage: jest.fn(),
    updateMemberLastRead: jest.fn(),
  };

  const mockUserId = new Types.ObjectId();
  const mockGroupId = new Types.ObjectId();

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const createGroupDto: CreateGroupDto = {
        name: 'Test Group',
        description: 'Test Description',
        privacy: GroupPrivacy.PUBLIC,
      };

      const expectedGroup = {
        _id: mockGroupId,
        ...createGroupDto,
        owner: mockUserId,
        members: [],
      };

      mockGroupRepository.create.mockResolvedValue(expectedGroup);

      const result = await service.create(createGroupDto, mockUserId);

      expect(repository.create).toHaveBeenCalledWith(createGroupDto, mockUserId);
      expect(result).toEqual(expectedGroup);
    });
  });

  describe('findAll', () => {
    it('should return all groups when no privacy filter', async () => {
      const expectedGroups = [{ _id: mockGroupId, name: 'Test Group' }];
      mockGroupRepository.findAll.mockResolvedValue(expectedGroups);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(expectedGroups);
    });

    it('should return filtered groups when privacy specified', async () => {
      const privacy = GroupPrivacy.PUBLIC;
      const expectedGroups = [{ _id: mockGroupId, name: 'Public Group' }];
      mockGroupRepository.findAll.mockResolvedValue(expectedGroups);

      const result = await service.findAll(privacy);

      expect(repository.findAll).toHaveBeenCalledWith({ privacy });
      expect(result).toEqual(expectedGroups);
    });
  });

  describe('findById', () => {
    it('should return a group if it exists', async () => {
      const expectedGroup = { _id: mockGroupId, name: 'Test Group' };
      mockGroupRepository.findById.mockResolvedValue(expectedGroup);

      const result = await service.findById(mockGroupId.toString());

      expect(repository.findById).toHaveBeenCalledWith(mockGroupId);
      expect(result).toEqual(expectedGroup);
    });

    it('should throw NotFoundException if group not found', async () => {
      mockGroupRepository.findById.mockResolvedValue(null);

      await expect(service.findById(mockGroupId.toString())).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const mockGroup = {
      _id: mockGroupId,
      name: 'Test Group',
      owner: { _id: mockUserId },
    };

    it('should update group if user is owner', async () => {
      const updateGroupDto: UpdatedGroupDto = {
        name: 'Updated Group',
        description: 'Updated Description',
      };

      mockGroupRepository.findById.mockResolvedValue(mockGroup);
      mockGroupRepository.update.mockResolvedValue({ ...mockGroup, ...updateGroupDto });

      const result = await service.update(mockGroupId.toString(), updateGroupDto, mockUserId);

      expect(repository.update).toHaveBeenCalledWith(mockGroupId, updateGroupDto);
      expect(result.name).toBe(updateGroupDto.name);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const nonOwnerUserId = new Types.ObjectId();
      mockGroupRepository.findById.mockResolvedValue(mockGroup);

      await expect(service.update(mockGroupId.toString(), { name: 'Updated' }, nonOwnerUserId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('member management', () => {
    const mockMemberId = new Types.ObjectId();
    const mockGroup = {
      _id: mockGroupId,
      owner: { _id: mockUserId },
      members: [
        { userId: { _id: mockUserId }, role: GroupRole.ADMIN },
        { userId: { _id: mockMemberId }, role: GroupRole.MEMBER },
      ],
    };

    describe('addMember', () => {
      it('should add member if requester is admin', async () => {
        const addMemberDto: AddMemberDto = {
          userId: new Types.ObjectId(),
          role: GroupRole.MEMBER,
        };

        mockGroupRepository.findById.mockResolvedValue(mockGroup);
        mockGroupRepository.addMember.mockResolvedValue({ ...mockGroup, members: [...mockGroup.members, addMemberDto] });

        const result = await service.addMember(mockGroupId.toString(), addMemberDto, mockUserId);

        expect(repository.addMember).toHaveBeenCalledWith(mockGroupId, addMemberDto.userId, addMemberDto.role);
        expect(result.members).toHaveLength(3);
      });

      it('should throw ForbiddenException if member already exists', async () => {
        const addMemberDto: AddMemberDto = {
          userId: mockMemberId,
          role: GroupRole.MEMBER,
        };

        mockGroupRepository.findById.mockResolvedValue(mockGroup);

        await expect(service.addMember(mockGroupId.toString(), addMemberDto, mockUserId)).rejects.toThrow(ForbiddenException);
      });
    });

    describe('removeMember', () => {
      it('should remove member if requester is admin', async () => {
        mockGroupRepository.findById.mockResolvedValue(mockGroup);
        mockGroupRepository.removeMember.mockResolvedValue({
          ...mockGroup,
          members: [mockGroup.members[0]],
        });

        const result = await service.removeMember(mockGroupId.toString(), mockMemberId.toString(), mockUserId);

        expect(repository.removeMember).toHaveBeenCalledWith(mockGroupId, mockMemberId);
        expect(result.members).toHaveLength(1);
      });

      it('should throw ForbiddenException if trying to remove owner', async () => {
        mockGroupRepository.findById.mockResolvedValue(mockGroup);

        await expect(service.removeMember(mockGroupId.toString(), mockUserId.toString(), mockUserId)).rejects.toThrow(ForbiddenException);
      });
    });
  });

  describe('message management', () => {
    const mockGroup = {
      _id: mockGroupId,
      owner: { _id: mockUserId },
      members: [{ userId: { _id: mockUserId }, lastRead: new Date(), joinedAt: new Date() }],
      lastMessage: { sentAt: new Date(), content: 'test' },
    };

    describe('checkMessageAccess', () => {
      it('should return true if user is member', async () => {
        mockGroupRepository.findById.mockResolvedValue(mockGroup);

        const result = await service.checkMessageAccess(mockGroupId.toString(), mockUserId);

        expect(result).toBe(true);
      });

      it('should throw ForbiddenException if user is not member', async () => {
        const nonMemberUserId = new Types.ObjectId();
        mockGroupRepository.findById.mockResolvedValue(mockGroup);

        await expect(service.checkMessageAccess(mockGroupId.toString(), nonMemberUserId)).rejects.toThrow(ForbiddenException);
      });
    });

    describe('updateLastMessage', () => {
      it('should update last message', async () => {
        const messageId = new Types.ObjectId();
        const content = 'New message';

        mockGroupRepository.updateLastMessage.mockResolvedValue({
          ...mockGroup,
          lastMessage: { messageId, content, type: MessageType.TEXT },
        });

        const result = await service.updateLastMessage(mockGroupId.toString(), messageId, content, mockUserId, MessageType.TEXT);

        expect(repository.updateLastMessage).toHaveBeenCalledWith(mockGroupId, messageId, content, mockUserId, MessageType.TEXT);
        expect(result.lastMessage.content).toBe(content);
      });
    });

    describe('getUnreadCount', () => {
      it('should return unread count', async () => {
        mockGroupRepository.findById.mockResolvedValue(mockGroup);

        const result = await service.getUnreadCount(mockGroupId.toString(), mockUserId);

        expect(result).toBeDefined();
        expect(typeof result).toBe('number');
      });

      it('should throw ForbiddenException if user is not member', async () => {
        const nonMemberUserId = new Types.ObjectId();
        mockGroupRepository.findById.mockResolvedValue(mockGroup);

        await expect(service.getUnreadCount(mockGroupId.toString(), nonMemberUserId)).rejects.toThrow(ForbiddenException);
      });
    });
  });
});
