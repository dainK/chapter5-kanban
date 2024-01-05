import _ from 'lodash';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
// import { UpdateBoardDto } from './dto/update-board.dto';
// import { DeleteBoardDto } from './dto/delete-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(@InjectRepository(Board) private boardRepository: Repository<Board>) {}

  // 보드 생성
  async create(createBoardDto: CreateBoardDto) {
    return await this.boardRepository.save(createBoardDto);
  }

  // 보드 전체조회
  findAll() {
    return `This action returns all board`;
  }

  // findOne(id: number) {
  //     return `This action returns a #${id} board`;
  // }

  // update(id: number, updateBoardDto: UpdateBoardDto) {
  //     return `This action updates a #${id} board`;
  // }

  // remove(id: number) {
  //     return `This action removes a #${id} board`;
  // }
}
