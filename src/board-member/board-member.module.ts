import { Module } from '@nestjs/common';
import { BoardMemberService } from './board-member.service';
import { BoardMemberController } from './board-member.controller';
import { BoardMember } from './entities/board-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BoardMember])],
  controllers: [BoardMemberController],
  providers: [BoardMemberService],
})
export class BoardMemberModule {}
