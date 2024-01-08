import { Module } from '@nestjs/common';
import { CardMemberService } from './card-member.service';
import { CardMemberController } from './card-member.controller';

@Module({
  controllers: [CardMemberController],
  providers: [CardMemberService],
  exports: [CardMemberService],
})
export class CardMemberModule {}
