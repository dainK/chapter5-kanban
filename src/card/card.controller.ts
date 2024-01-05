import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @UseGuards(AuthGuard('jwt')) // 로그인 유저 인증
  // 보드 멤버 인증?
  @Post()
  create(@Body() createCardDto: CreateCardDto, @Req() req) {
    return this.cardService.create(createCardDto, +req.user.id);
  }

  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto, @Req() req) {
    return this.cardService.update(+id, updateCardDto, +req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.cardService.remove(+id, +req.user.id);
  }
}
