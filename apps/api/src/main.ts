import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { branding } from './utils/branding';
import { MigrationService } from './shared/database/services/database-migration.service';
import { existsSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const logger: Logger = new Logger('Bootstrap');

  // Config Variables =====================================================
  const configService = app.get(ConfigService);
  const env = configService.get<string>('app.env') || process.env.NODE_ENV || 'development';

  const port = configService.get<number>('app.http.port') || 5000;

  const globalPrefix = configService.get<string>('app.globalPrefix') ?? 'api';
  app.setGlobalPrefix(globalPrefix);

  if (env === 'development') {
    const docName = configService.get<string>('doc.name') || 'API Documentation';
    const docDesc =
      configService.get<string>('doc.description') || 'Section for describe whole APIs';
    const docVersion = configService.get<string>('doc.version') || '1.0';
    const docPrefix = configService.get<string>('doc.prefix') || '/docs';

    // Swagger ================================================================
    const documentBuild = new DocumentBuilder()
      .setTitle(docName)
      .setDescription(docDesc)
      .setVersion(docVersion)
      .addServer('/', 'Current origin')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access_token')
      .build();

    try {
      const document = SwaggerModule.createDocument(app, documentBuild, {
        deepScanRoutes: true,
        extraModels: [],
      });

      const publicDir = existsSync(join(__dirname, 'public'))
        ? join(__dirname, 'public')
        : join(__dirname, '..', 'public');
      app.useStaticAssets(publicDir);

      SwaggerModule.setup(docPrefix, app, document, {
        explorer: true,
        customSiteTitle: docName,
        customJs: '/swagger-custom.js',
        swaggerOptions: {
          persistAuthorization: true,
        },
      });
    } catch (error) {
      logger.error(error);
    }
  } else {
    logger.log('Swagger disabled - not in development environment');
  }

  await app.listen(port);

  branding(logger);
  logger.log(`==========================================================`);
  logger.log(`Http Server running on ${await app.getUrl()}`, 'NestApplication');
  logger.log(`Timezone set to ${process.env.TZ}`);
  logger.log(`Storage driver set to ${process.env.STORAGE_DRIVER}`);
  logger.log(`==========================================================`);

  //Migrations ==========================================================
  const synchronize = configService.get<boolean>('database.synchronize');
  if (!synchronize) {
    const migrationService = app.get(MigrationService);
    const migrationPath = join(__dirname, 'assets', 'migrations');
    try {
      // Create migrations table if it does not exist
      await migrationService.createMigrationsTableIfNotExists();
      const migrationFiles = migrationService.loadMigrationFiles(migrationPath);
      const existingMigrations = await migrationService.findAll({});
      // Check if there are any migrations to run
      const needToRunMigrations = migrationService.runNeeded(migrationFiles, existingMigrations);
      if (needToRunMigrations) {
        await migrationService.runMigrations(migrationPath, migrationFiles);
      }
    } catch (error) {
      logger.error('Migration process failed', error);
    }
  }
}

void bootstrap();
