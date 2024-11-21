import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './groups.controller';
import { GroupService } from './providers/groups.service';
import { Types } from 'mongoose';
import { CreateGroupDto } from './dtos/create-group.dto';
import { UpdatedGroupDto } from './dtos/update-group.dto';
import { AddMemberDto } from './dtos/add-member.dto';
import { GroupPrivacy, GroupRole } from '@/utils/types';

describe('GroupController', () => {
  let controller: GroupController;
  let service: GroupService;

  const mockGroupService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addMember: jest.fn(),
    removeMember: jest.fn(),
    updateMemberRole: jest.fn(),
    getUnreadCount: jest.fn(),
    updateMemberLastRead: jest.fn(),
  };

  const mockRequest = {
    user: {
      userId: '507f1f77bcf86cd799439011',
    },
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const createGroupDto: CreateGroupDto = {
        name: 'Test Group',
        description: 'Test Description',
        privacy: GroupPrivacy.PUBLIC,
      };

      const expectedResult = { id: 'groupId', ...createGroupDto };
      mockGroupService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createGroupDto, mockRequest);

      expect(service.create).toHaveBeenCalledWith(createGroupDto, new Types.ObjectId(mockRequest.user.userId));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all groups', async () => {
      const expectedGroups = [{ id: '1', name: 'Group 1' }];
      mockGroupService.findAll.mockResolvedValue(expectedGroups);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedGroups);
    });

    it('should return filtered groups by privacy', async () => {
      const privacy = GroupPrivacy.PUBLIC;
      const expectedGroups = [{ id: '1', name: 'Public Group' }];
      mockGroupService.findAll.mockResolvedValue(expectedGroups);

      const result = await controller.findAll(privacy);

      expect(service.findAll).toHaveBeenCalledWith(privacy);
      expect(result).toEqual(expectedGroups);
    });
  });

  describe('findOne', () => {
    it('should return a single group', async () => {
      const groupId = '507f1f77bcf86cd799439011';
      const expectedGroup = { id: groupId, name: 'Test Group' };
      mockGroupService.findById.mockResolvedValue(expectedGroup);

      const result = await controller.findOne(groupId);

      expect(service.findById).toHaveBeenCalledWith(groupId);
      expect(result).toEqual(expectedGroup);
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const groupId = '507f1f77bcf86cd799439011';
      const updateGroupDto: UpdatedGroupDto = {
        name: 'Updated Group',
        description: 'Updated Description',
      };
      const expectedResult = { id: groupId, ...updateGroupDto };
      mockGroupService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(groupId, updateGroupDto, mockRequest);

      expect(service.update).toHaveBeenCalledWith(groupId, updateGroupDto, new Types.ObjectId(mockRequest.user.userId));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should delete a group', async () => {
      const groupId = '507f1f77bcf86cd799439011';
      const expectedResult = { deleted: true };
      mockGroupService.delete.mockResolvedValue(expectedResult);

      const result = await controller.remove(groupId, mockRequest);

      expect(service.delete).toHaveBeenCalledWith(groupId, new Types.ObjectId(mockRequest.user.userId));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('member management', () => {
    const groupId = '507f1f77bcf86cd799439011';
    const memberId = '507f1f77bcf86cd799439012';

    it('should add a member to group', async () => {
      const addMemberDto: AddMemberDto = {
        userId: new Types.ObjectId(memberId),
        role: GroupRole.MEMBER,
      };
      const expectedResult = { success: true };
      mockGroupService.addMember.mockResolvedValue(expectedResult);

      const result = await controller.addMember(groupId, addMemberDto, mockRequest);

      expect(service.addMember).toHaveBeenCalledWith(groupId, addMemberDto, new Types.ObjectId(mockRequest.user.userId));
      expect(result).toEqual(expectedResult);
    });

    it('should remove a member from group', async () => {
      const expectedResult = { success: true };
      mockGroupService.removeMember.mockResolvedValue(expectedResult);

      const result = await controller.removeMember(groupId, memberId, mockRequest);

      expect(service.removeMember).toHaveBeenCalledWith(groupId, memberId, new Types.ObjectId(mockRequest.user.userId));
      expect(result).toEqual(expectedResult);
    });

    it('should update member role', async () => {
      const role = GroupRole.ADMIN;
      const expectedResult = { success: true };
      mockGroupService.updateMemberRole.mockResolvedValue(expectedResult);

      const result = await controller.updateMemberRole(groupId, memberId, role, mockRequest);

      expect(service.updateMemberRole).toHaveBeenCalledWith(groupId, memberId, role, new Types.ObjectId(mockRequest.user.userId));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('message management', () => {
    const groupId = '507f1f77bcf86cd799439011';

    it('should get unread messages count', async () => {
      const expectedResult = { count: 5 };
      mockGroupService.getUnreadCount.mockResolvedValue(expectedResult);

      const result = await controller.getUnreadCount(groupId, mockRequest);

      expect(service.getUnreadCount).toHaveBeenCalledWith(groupId, new Types.ObjectId(mockRequest.user.userId));
      expect(result).toEqual(expectedResult);
    });

    it('should mark messages as read', async () => {
      const expectedResult = { success: true };
      mockGroupService.updateMemberLastRead.mockResolvedValue(expectedResult);

      const result = await controller.markAsRead(groupId, mockRequest);

      expect(service.updateMemberLastRead).toHaveBeenCalledWith(groupId, new Types.ObjectId(mockRequest.user.userId));
      expect(result).toEqual(expectedResult);
    });
  });
});
