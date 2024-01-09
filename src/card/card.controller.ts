import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  //@UseGuards(AuthGuard('jwt')) // 로그인 유저 인증
  // 보드 멤버 인증?
  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  @Get('column/:boardColumnId')
  findAllByColumnId(@Param(':boardColumnId') boardColumnId: number) {
    return this.cardService.findAllByColumnId(+boardColumnId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cardService.findOne(+id);
  }

  // @UseGuards(AuthGuard('jwt')) // 로그인 유저 인증
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  // @UseGuards(AuthGuard('jwt')) // 로그인 유저 인증
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cardService.remove(+id);
  }
}
