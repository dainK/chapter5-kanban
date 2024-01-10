import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글 생성
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Post(':cardId')
  create(@Body() createCommentDto: CreateCommentDto, @Param('cardId') cardId: number, @Req() req) {
    return this.commentService.create(createCommentDto.comment, +cardId, +req.user.id);
  }

  // 해당 카드의 댓글 전체 조회
  @Get('ofCard/:cardId')
  findCommentByCardId(@Param('cardId') cardId: number) {
    return this.commentService.findCommentByCardId(+cardId);
  }

  // 해당 카드의 댓글 상세 조회
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() req) {
    return this.commentService.update(+id, updateCommentDto.comment, +req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.commentService.remove(+id, +req.user.id);
  }
}
