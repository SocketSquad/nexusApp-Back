import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from '../utils/interceptors/transform.interceptor';
import { ProfileService } from './providers/profile.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Profile } from './schemas/profile.schema';

@Controller('profiles')
@UseInterceptors(TransformInterceptor)
export class ProfilesController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':userId')
  async getProfileByUserId(@Param('userId') userId: string) {
    return this.profileService.findProfileByUserId(userId);
  }

  @Put(':userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.profileService.updateProfile(
      userId,
      updateProfileDto,
    );
    return profile;
  }

  @Put(':userId/block')
  async updateBlockStatus(
    @Param('userId') userId: string,
    @Body('isBlocked') isBlocked: boolean,
  ) {
    return this.profileService.updateBlockStatus(userId, isBlocked);
  }
}
