import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'aws-sdk';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { logger: ['log', 'debug', 'error', 'warn'] });

    app.enableCors({
      origin: ['http://localhost:5173'],
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // set the aws sdk used to upload files and images to aws s3 bucket
    config.update({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Application failed to start:', error);
    process.exit(1);
  }
}

bootstrap();
