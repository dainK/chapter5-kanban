import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { BoardMemberService } from './board-member.service';
import { BoardMemberController } from './board-member.controller';
import { BoardMember } from './entities/board-member.entity';
import { User } from 'src/user/entities/user.entity';
import { Board } from 'src/board/entities/board.entity';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    TypeOrmModule.forFeature([BoardMember]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Board]),
    EventsModule
  ],
  controllers: [BoardMemberController],
  providers: [BoardMemberService],
  exports: [BoardMemberService, TypeOrmModule.forFeature([BoardMember])],
})
export class BoardMemberModule {}
