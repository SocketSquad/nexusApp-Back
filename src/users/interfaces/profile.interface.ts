import { Profile } from '../schemas/profile.schema';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

export interface IProfileService {
  findByUserId(userId: string): Promise<Profile>;
  create(createProfileDto: CreateProfileDto): Promise<Profile>;
  update(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile>;
  updateBlockStatus(userId: string, isBlocked: boolean): Promise<Profile>;
}
