import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('JwtAuthGuard');
    const request = context.switchToHttp().getRequest();
    // const accessToken = request.get('request.headers.authorization');
    const user = request.user;
    try {
      // 엑세스 토큰 조회
      const accessToken = request.headers.authorization;
      console.log('accessToken: ', accessToken);
      const [authType, authToken] = (accessToken ?? '').split(' ');
      const JWT_SECRET_KEY = this.configService.get('JWT_SECRET_KEY'); // 이러면 .env 파일에 있는 secret 키가 노출되는데 이거 맞나? - 이아영
      const decoded = jwt.verify(authToken, JWT_SECRET_KEY); // 토큰 에러 날 가능성이 Bearer가 아닐때, 유효기간이 지났을 때 말고 더 있을까? - 이아영
    } catch (error) {
      // 액세스 토큰 유효기간 만료 에러
      if (error instanceof jwt.TokenExpiredError) {
        console.log('유효기간 만료 에러 발생중');
        const refreshToken = await this.redisService.getRefreshToken(String(user.id)); // 리프레시 토큰 조회
        // 리프레시 토큰이 존재하지 않는 경우(기간 만료 || 로그아웃 || 계정 삭제)
        if (!refreshToken) {
          throw new UnauthorizedException('다시 로그인을 진행해주세요.(사유 : 리프레시 토큰 X)');
        }
        // 리프레시 토큰이 유효한 경우
        // 액세스 토큰 갱신 API 별도 생성(auth.modoudle)
        // if (refreshToken) {
        //   // 액세스 토큰 토큰 갱신 시키기
        //   const payload = { email: user.email, sub: user.id };
        //   const accessToken = this.jwtService.sign(payload, { expiresIn: '10m' }); // 얘를 REST CLIENT에 어케 적용시키냐..
        // }
      }
    }
    return true;
  }
}
