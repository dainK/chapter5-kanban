import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 보드 생성
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Post('create')
  create(@Body() createBoardDto: CreateBoardDto, @Req() req) {
    return this.boardService.create(createBoardDto, req.user.id);
  }

  // 보드 목록 조회
  @Get()
  findAll() {
    return this.boardService.findAll();
  }
  // 보드 상세 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  // 보드 수정
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  // 보드 삭제
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
