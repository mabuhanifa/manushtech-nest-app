import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { SeedCommand } from 'src/commands/seed.command';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ConsoleModule, DatabaseModule],
  providers: [SeedCommand],
})
export class ConsoleCommandsModule {}
