import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BoardColumnService } from './board-column.service';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';

import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller(':board_id/board-column')
export class BoardColumnController {
  constructor(private readonly boardColumnService: BoardColumnService) {}

  // 칼럼 생성
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Post()
  create(@Body() createBoardColumnDto: CreateBoardColumnDto, @Param('board_id') board_id: number, @Req() req) {
    return this.boardColumnService.create(createBoardColumnDto, board_id, req.user.id);
  }

  // 칼럼 목록 조회
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Get()
  findAll(@Param('board_id') board_id: number, @Req() req) {
    return this.boardColumnService.findAll(board_id, req.user.id);
  }

  // 칼럼 상세 조회
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Get(':id')
  findOne(@Param('board_id') board_id: number, @Param('id') id: string, @Req() req) {
    return this.boardColumnService.findOne(+id, board_id, req.user.id);
  }

  // 칼럼 수정
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Patch(':id')
  update(@Param('board_id') board_id: number, @Param('id') id: string, @Body() updateBoardColumnDto: UpdateBoardColumnDto, @Req() req) {
    return this.boardColumnService.update(+id, updateBoardColumnDto, board_id, req.user.id);
  }
  // 칼럼 삭제
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Delete(':id')
  remove(@Param('board_id') board_id: number, @Param('id') id: string, @Req() req) {
    return this.boardColumnService.remove(+id, board_id, req.user.id);
  }
}
