import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { BoardMemberService } from './board-member.service';
import { BoardMemberController } from './board-member.controller';
import { BoardMember } from './entities/board-member.entity';
import { Board } from 'src/board/entities/board.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    TypeOrmModule.forFeature([Board]),
    TypeOrmModule.forFeature([BoardMember]),
  ],
  controllers: [BoardMemberController],
  providers: [BoardMemberService],
  exports: [BoardMemberService, TypeOrmModule.forFeature([BoardMember])],
})
export class BoardMemberModule {}
