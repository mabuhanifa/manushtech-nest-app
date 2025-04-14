import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SeedCommand } from './commands/seed.command';
import { ConsoleCommandsModule } from './console/console.module';
import { DatabaseModule } from './database/database.module';
import { SeederService } from './database/seeder.service';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { RedisModule } from './redis/redis.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    OrdersModule,
    ProductsModule,
    AuthModule,
    UsersModule,
    DatabaseModule,
    ConsoleCommandsModule,
    ReportsModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService, SeedCommand],
})
export class AppModule {}
