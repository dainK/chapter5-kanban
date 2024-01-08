import { Injectable, ConflictException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}
  async create(createBoardDto: CreateBoardDto, user_id: number) {
    console.log('보드 생성 중');
    console.log(createBoardDto.title);
    console.log(user_id);
    // 제목 조회
    const existingBoardTitle = await this.boardRepository.findOne({
      where: { title: createBoardDto.title },
    });

    // ERR : 이미 제목이 존재할 경우
    if (existingBoardTitle) {
      throw new ConflictException('이미 보드 제목이 존재합니다.');
    }

    // 보드 정보 저장
    await this.boardRepository.save({
      title: createBoardDto.title,
      user_id,
    });

    return { message: '보드 저장이 완료되었습니다.', board: { title: createBoardDto.title } };
  }

  findAll() {
    return `This action returns all board`;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
