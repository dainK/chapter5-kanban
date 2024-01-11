import { Module } from '@nestjs/common';
import { CardMemberService } from './card-member.service';
import { CardMemberController } from './card-member.controller';
import { CardMember } from './entities/card-member.entity';
import { User } from 'src/user/entities/user.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { Card } from 'src/card/entities/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardColumn } from 'src/board-column/entities/board-column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardMember]), TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([BoardMember]), TypeOrmModule.forFeature([Card]), TypeOrmModule.forFeature([BoardColumn])],
  controllers: [CardMemberController],
  providers: [CardMemberService],
  exports: [CardMemberService],
})
export class CardMemberModule {}
