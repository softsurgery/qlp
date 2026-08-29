import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MigrationService } from './common/database/migration.service';
import { SeedService } from './common/database/seed.service';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) || [
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('QLP API')
    .setDescription('Quran E-Learning Platform API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const migrationService = app.get(MigrationService);
  const distMigrations = join(__dirname, 'migrations');
  const srcMigrations = join(__dirname, '../../src/migrations');
  const migrationPath = existsSync(distMigrations) ? distMigrations : srcMigrations;
  await migrationService.runMigrations(migrationPath);

  const seedService = app.get(SeedService);
  await seedService.seed();

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`QLP API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();
