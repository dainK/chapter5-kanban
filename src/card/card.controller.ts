import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard) // 로그인 유저 인증
  @Post(':board_column_id')
  create(@Body() createCardDto: CreateCardDto, @Param('board_column_id') board_column_id: number) {
    return this.cardService.create(createCardDto, +board_column_id);
  }

  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  // 특정 보드 카드 조회
  // @Get('board/:boardColumnId')
  // findAllByBoardId(@Param('boardId') boardId: number) {
  //   return this.cardService.findAllByBoardId(+boardId);
  // }

  @Get('boardColumn/:boardColumnId')
  findAllByColumnId(@Param('boardColumnId') boardColumnId: number) {
    return this.cardService.findAllByColumnId(+boardColumnId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cardService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard) // 로그인 유저 인증
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto) {
    console.log('updateCardDto: ', updateCardDto);
    return this.cardService.update(+id, updateCardDto);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard) // 로그인 유저 인증
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cardService.remove(+id);
  }
}
