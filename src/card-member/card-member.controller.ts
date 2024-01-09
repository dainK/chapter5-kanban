import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CardMemberService } from './card-member.service';
import { CreateCardMemberDto } from './dto/create-card-member.dto';

@Controller('card-member')
export class CardMemberController {
  constructor(private readonly cardMemberService: CardMemberService) {}

  @Post()
  create(@Body() createCardMemberDto: CreateCardMemberDto) {
    return this.cardMemberService.create(createCardMemberDto);
  }

  @Get(':userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.cardMemberService.findAllByUserId(+userId);
  }

  @Get(':cardId')
  findAllByCardId(@Param('cardId') cardId: string) {
    return this.cardMemberService.findAllByUserId(+cardId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardMemberService.remove(+id);
  }
}
