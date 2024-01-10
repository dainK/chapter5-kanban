import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { BoardColumnService } from './board-column.service';
import { BoardColumnController } from './board-column.controller';
import { BoardColumn } from 'src/board-column/entities/board-column.entity';
import { Board } from 'src/board/entities/board.entity';
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
    TypeOrmModule.forFeature([Board, BoardColumn, BoardMember]),
  ],
  controllers: [BoardColumnController],
  providers: [BoardColumnService],
  exports: [BoardColumnService, TypeOrmModule.forFeature([BoardColumn])],
})
export class BoardColumnModule {}
