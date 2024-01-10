import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BoardMemberService } from './board-member.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('board-member')
export class BoardMemberController {
  constructor(private readonly boardMemberService: BoardMemberService) {}

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Post(':board_id')
  create(@Param('board_id') board_id: number, @Req() req, @Body('user_id') select_user_id: number, @Body('role') role: number) {
    return this.boardMemberService.create(board_id, req.user.id, select_user_id, role);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Get(':board_id')
  findAll(@Param('board_id') board_id: number, @Req() req) {
    return this.boardMemberService.findAll(board_id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Get(':board_id/:memberKeyword')
  searchAll(@Param('board_id') board_id: number, @Req() req, @Param('memberKeyword') memberKeyword: string) {
    return this.boardMemberService.searchAll(board_id, req.user.id, memberKeyword);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Get(':board_id/:user_id')
  findOne(@Param('board_id') board_id: number, @Param('user_id') select_user_id: number, @Req() req) {
    return this.boardMemberService.findOne(board_id, req.user.id, select_user_id);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Patch(':board_id/:user_id')
  update(@Param('board_id') board_id: number, @Req() req, @Param('user_id') select_user_id: number, @Body('role') role: number) {
    return this.boardMemberService.update(board_id, req.user.id, select_user_id, role);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Delete(':board_id/:user_id')
  remove(@Param('board_id') board_id: number, @Req() req, @Param('user_id') select_user_id: number) {
    return this.boardMemberService.remove(board_id, req.user.id, select_user_id);
  }
}
