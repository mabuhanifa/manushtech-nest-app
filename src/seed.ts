import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './database/seeder.service';

async function bootstrap() {
  const logger = new Logger('SeedingScript');
  const app = await NestFactory.createApplicationContext(AppModule);

  logger.log('Application context created, running seed service...');
  const seedService = app.get(SeederService);

  try {
    await seedService.seed();
    logger.log('Seeding finished successfully.');
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
    logger.log('Application context closed.');
    process.exit(0);
  }
}

bootstrap();
