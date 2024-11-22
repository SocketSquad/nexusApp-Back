import { Test, TestingModule } from '@nestjs/testing';
import { S3 } from 'aws-sdk';
import { UploadService } from './upload.service';

jest.mock('aws-sdk', () => {
  const mockS3Instance = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return { S3: jest.fn(() => mockS3Instance) };
});

describe('UploadService', () => {
  let service: UploadService;
  let s3: S3;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
    s3 = new S3();
  });

  it('should upload a file to S3', async () => {
    const file = {
      originalname: 'test-document.pdf',
      mimetype: 'application/pdf',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    const uploadResult = {
      url: 'https://s3.amazonaws.com/your-bucket/uploads/test-document.pdf',
      key: 'uploads/test-document.pdf',
    };

    (s3.upload as jest.Mock).mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Location: uploadResult.url,
        Key: uploadResult.key,
      }),
    });

    const result = await service.uploadFile(file);

    expect(result).toEqual(uploadResult);
    expect(s3.upload).toHaveBeenCalledWith({
      Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
      Key: expect.any(String),
      Body: file.buffer,
      ContentType: file.mimetype,
    });
  });
});
