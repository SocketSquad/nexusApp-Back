import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { GroupController } from './groups.controller';
import { GroupService } from './providers/groups.service';
import { GroupPrivacy, GroupRole } from '@/utils/types';
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
      const req = { user: { userId: new Types.ObjectId().toString() } };

      const result = await controller.create(createGroupDto, req);

      expect(service.create).toHaveBeenCalledWith(
        createGroupDto, 
        expect.any(Types.ObjectId)
      );
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
      const updateGroupDto: UpdatedGroupDto = {
        name: 'Updated Group Name',
      };
      const req = { user: { userId: mockGroup.owner.toString() } };

      const result = await controller.update(groupId, updateGroupDto, req);

      expect(service.update).toHaveBeenCalledWith(
        groupId,
        updateGroupDto,
        expect.any(Types.ObjectId)
      );
      expect(result).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should remove a group', async () => {
      const groupId = mockGroup._id.toString();
      const req = { user: { userId: mockGroup.owner.toString() } };

      const result = await controller.remove(groupId, req);

      expect(service.delete).toHaveBeenCalledWith(
        groupId,
        expect.any(Types.ObjectId)
      );
      expect(result).toBeDefined();
    });
  });

  describe('addMember', () => {
    it('should add a member to the group', async () => {
      const groupId = mockGroup._id.toString();
      const newMemberId = new Types.ObjectId();
      const addMemberDto: AddMemberDto = {
        userId: newMemberId,
        role: GroupRole.MEMBER,
      };
      const req = { user: { userId: mockGroup.owner.toString() } };

      const result = await controller.addMember(groupId, addMemberDto, req);

      expect(service.addMember).toHaveBeenCalledWith(
        groupId,
        addMemberDto,
        expect.any(Types.ObjectId)
      );
      expect(result).toBeDefined();
    });
  });

  describe('removeMember', () => {
    it('should remove a member from the group', async () => {
      const groupId = mockGroup._id.toString();
      const memberId = new Types.ObjectId().toString();
      const req = { user: { userId: mockGroup.owner.toString() } };

      const result = await controller.removeMember(groupId, memberId, req);

      expect(service.removeMember).toHaveBeenCalledWith(
        groupId,
        memberId,
        expect.any(Types.ObjectId)
      );
      expect(result).toBeDefined();
    });
  });

  describe('updateMemberRole', () => {
    it('should update a member role', async () => {
      const groupId = mockGroup._id.toString();
      const memberId = new Types.ObjectId().toString();
      const role = GroupRole.ADMIN;
      const req = { user: { userId: mockGroup.owner.toString() } };

      const result = await controller.updateMemberRole(
        groupId,
        memberId,
        role,
        req
      );

      expect(service.updateMemberRole).toHaveBeenCalledWith(
        groupId,
        memberId,
        role,
        expect.any(Types.ObjectId)
      );
      expect(result).toBeDefined();
    });
  });
});