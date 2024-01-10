import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CardMemberService } from './card-member.service';
import { CreateCardMemberDto } from './dto/create-card-member.dto';

@Controller('card-member')
export class CardMemberController {
  constructor(private readonly cardMemberService: CardMemberService) {}

  // 카드 멤버 생성
  @Post()
  create(@Body() createCardMemberDto: CreateCardMemberDto) {
    return this.cardMemberService.create(createCardMemberDto);
  }

  // 해당 사용자가 담당중인 카드 정렬
  @Get(':userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.cardMemberService.findAllByUserId(+userId);
  }

  // 해당 카드를 담당하는 사용자 정렬
  @Get(':cardId')
  findAllByCardId(@Param('cardId') cardId: string) {
    return this.cardMemberService.findAllByUserId(+cardId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardMemberService.remove(+id);
  }
}
