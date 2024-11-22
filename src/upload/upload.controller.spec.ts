import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UploadModule } from './upload.module';
import { UploadService } from './providers/upload.service';

describe('UploadController (e2e)', () => {
  let app: INestApplication;

  // Mock upload service to control S3 upload behavior
  const mockUploadService = {
    uploadFile: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UploadModule],
    })
      .overrideProvider(UploadService)
      .useValue(mockUploadService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Reset mock calls before each test
    mockUploadService.uploadFile.mockReset();
  });

  it('/POST upload file (successful)', async () => {
    // Mock successful file upload
    const mockUploadResult = {
      url: 'https://example.com/uploaded-file.jpg',
      key: 'uploads/some-uuid.jpg',
    };
    mockUploadService.uploadFile.mockResolvedValue(mockUploadResult);

    // Create a mock file buffer
    const mockFile = Buffer.from('test file content');

    const response = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', mockFile, 'test-file.jpg')
      .expect(201);

    expect(response.body).toEqual(mockUploadResult);
    expect(mockUploadService.uploadFile).toHaveBeenCalledTimes(1);
  });

  it('/POST upload file (error handling)', async () => {
    // Mock file upload failure
    mockUploadService.uploadFile.mockRejectedValue(
      new Error('Internal server error'),
    );

    // Create a mock file buffer
    const mockFile = Buffer.from('test file content');

    const response = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', mockFile, 'test-file.jpg')
      .expect(500);

    expect(response.body.message).toContain('Internal server error');
  });
});
