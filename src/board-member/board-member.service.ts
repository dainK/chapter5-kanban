import { Injectable } from '@nestjs/common';
import { CreateBoardMemberDto } from './dto/create-board-member.dto';
// import { DeleteBoardMemberDto } from './dto/delete-board-member.dto';

@Injectable()
export class BoardMemberService {
  create(createBoardMemberDto: CreateBoardMemberDto) {
    return 'This action adds a new boardMember';
  }

  findAll() {
    return `This action returns all boardMember`;
  }

  // findOne(id: number) {
  //     return `This action returns a #${id} boardMember`;
  // }

  remove(id: number) {
    return `This action removes a #${id} boardMember`;
  }
}
