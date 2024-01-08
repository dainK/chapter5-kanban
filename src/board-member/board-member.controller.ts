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
  @Get(':board_id/:user_id')
  findOne(@Param('user_id') select_user_id: number, @Param('board_id') board_id: number, @Req() req) {
    return this.boardMemberService.findOne(board_id, req.user.id, select_user_id);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Patch(':board_id/:user_id')
  update(@Param('id') id: string, @Req() req, @Param('board_id') board_id: number, @Param('user_id') select_user_id: number, @Body('role') role: number) {
    return this.boardMemberService.update(+id, req.user.id, board_id, select_user_id, role);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Delete(':board_id/:user_id')
  remove(@Param('id') id: string, @Req() req, @Param('board_id') board_id: number, @Param('user_id') select_user_id: number) {
    return this.boardMemberService.remove(+id, req.user.id, board_id, select_user_id);
  }
}
