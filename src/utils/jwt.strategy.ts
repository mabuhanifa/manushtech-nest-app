import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallbackSecret',
      issuer: configService.get<string>('JWT_ISSUER') || 'admin',
      audience: configService.get<string>('JWT_AUDIENCE') || 'nest-app',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const isValid = await this.authService.validateToken(
        Number(payload.sub),
        JSON.stringify(payload),
      );
      if (!isValid) {
        throw new UnauthorizedException('Invalid token');
      }
      return {
        userId: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token', { cause: error });
    }
  }
}
