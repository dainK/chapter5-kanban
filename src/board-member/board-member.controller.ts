import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardMemberService } from './board-member.service';
import { CreateBoardMemberDto } from './dto/create-board-member.dto';
// import { DeleteBoardMemberDto } from './dto/delete-board-member.dto';

@Controller('board-member')
export class BoardMemberController {
  constructor(private readonly boardMemberService: BoardMemberService) {}

  @Post()
  create(@Body() createBoardMemberDto: CreateBoardMemberDto) {
    return this.boardMemberService.create(createBoardMemberDto);
  }

  @Get()
  findAll() {
    return this.boardMemberService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //     return this.boardMemberService.findOne(+id);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardMemberService.remove(+id);
  }
}
