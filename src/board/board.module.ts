import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board } from './entities/board.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';


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
    TypeOrmModule.forFeature([BoardMember])
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService, TypeOrmModule.forFeature([Board])],
})
export class BoardModule {}
