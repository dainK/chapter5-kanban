import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BoardService } from './board.service';
import { UpdateBoardDto } from './dto/update-board.dto';

import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 보드 생성
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Post()
  create(@Req() req) {
    return this.boardService.create(req.user.id);
  }

  // 보드 목록 조회
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.boardService.findAll(req.user.id);
  }

  // 보드 상세 조회
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.boardService.findOne(+id, req.user.id);
  }

  // 보드 수정
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto, @Req() req) {
    return this.boardService.update(+id, updateBoardDto, req.user.id);
  }

  // 보드 삭제
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.boardService.remove(+id, req.user.id);
  }
}
