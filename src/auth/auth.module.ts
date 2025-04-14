import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'strong_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
