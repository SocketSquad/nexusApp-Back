// import { Controller, Post, Get, Param, Body, UploadedFile, UseInterceptors, Request, UseGuards } from '@nestjs/common';
// import { AttachmentsService } from './providers/attachments.service';
// import { CreateAttachmentDto } from './dtos/create-attachments.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

// @Controller('attachments')
// @UseGuards(JwtAuthGuard)
// export class AttachmentsController {
//   constructor(private readonly attachmentsService: AttachmentsService) {}

//   // Create a new attachment (simplified)
//   @Post()
//   @UseInterceptors(FileInterceptor('file')) // Handle file upload with Multer
//   async create(
//     @Body() createAttachmentDto: CreateAttachmentDto, // Attachment metadata
//     @UploadedFile() file: Express.Multer.File, // The file being uploaded
//     @Request() req, // User making the request (to get user ID)
//   ) {
//     // Pass the DTO, uploader ID, and file to the service
//     return this.attachmentsService.create(createAttachmentDto, req.user.id, file);
//   }

//   // Get attachment by ID (simplified)
//   @Get(':id')
//   async findById(@Param('id') id: string) {
//     return this.attachmentsService.findById(id);
//   }
// }
