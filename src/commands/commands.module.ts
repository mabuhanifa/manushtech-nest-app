import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { DatabaseModule } from '../database/database.module';
import { SeedCommand } from './seed.command';

@Module({
  imports: [ConsoleModule, DatabaseModule],
  providers: [SeedCommand],
})
export class CommandsModule {}
