import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      jti: this.generateJti(),
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const cacheKey = `user:${user.id}:session`;
    await this.cacheManager.set(cacheKey, token, 3600 * 1000);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async logout(userId: number) {
    const cacheKey = `user:${userId}:session`;
    await this.cacheManager.del(cacheKey);
    return { message: 'Logged out successfully' };
  }

  async validateToken(userId: number, token: string): Promise<boolean> {
    const cacheKey = `user:${userId}:session`;
    const storedToken = await this.cacheManager.get<string>(cacheKey);

    if (!storedToken) {
      return false;
    }

    return this.secureCompare(storedToken, token);
  }

  private generateJti(): string {
    return require('crypto').randomBytes(16).toString('hex');
  }

  private secureCompare(a: string, b: string): boolean {
    try {
      return require('crypto').timingSafeEqual(Buffer.from(a), Buffer.from(b));
    } catch {
      return false;
    }
  }
}
