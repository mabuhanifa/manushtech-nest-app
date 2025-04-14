import { Command, Console } from 'nestjs-console';
import { SeederService } from '../database/seeder.service';

@Console()
export class SeedCommand {
  constructor(private readonly seederService: SeederService) {}

  @Command({
    command: 'seed',
    description: 'Seed the database',
  })
  async seed() {
    await this.seederService.seed();
  }
}
