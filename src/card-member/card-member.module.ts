import { Module } from '@nestjs/common';
import { CardMemberService } from './card-member.service';
import { CardMemberController } from './card-member.controller';
import { CardMember } from './entities/card-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CardMember])],
  controllers: [CardMemberController],
  providers: [CardMemberService],
  exports: [CardMemberService],
})
export class CardMemberModule {}
