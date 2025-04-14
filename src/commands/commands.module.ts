import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SeedCommand } from './seed.command';

@Module({
  imports: [DatabaseModule],
  providers: [SeedCommand],
})
export class CommandsModule {}
