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

  @Get(':boardColumnId')
  findAllByColumnId(@Param(':boardColumnId') boardColumnId: number) {
    return this.cardService.findAllByColumnId(+boardColumnId);
  }

  @Get('board_column_id/:id')
  findOne(@Param('board_column_id') board_column_id: number, @Param('id') id: number) {
    return this.cardService.findOne(+board_column_id, +id);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard) // 로그인 유저 인증
  @Patch(':board_column_id/:id')
  update(@Param('board_column_id') board_column_id: number, @Param('id') id: number, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+board_column_id, +id, updateCardDto);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard) // 로그인 유저 인증
  @Delete(':board_column_id/:id')
  remove(@Param('board_column_id') board_column_id: number, @Param('id') id: number) {
    return this.cardService.remove(+board_column_id, +id);
  }
}
