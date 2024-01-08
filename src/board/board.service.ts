import { Injectable, ConflictException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
  ) {}

  async create(createBoardDto: CreateBoardDto, user_id: number) {
    // 제목 조회
    const existingBoardTitle = await this.boardRepository.findOne({
      where: { title: createBoardDto.title },
    });

    // ERR : 이미 제목이 존재할 경우
    if (existingBoardTitle) {
      throw new ConflictException('이미 보드 제목이 존재합니다.');
    }

    // 보드 정보 저장
    const boardDetail = await this.boardRepository.save({
      title: createBoardDto.title,
      user_id,
    });

    console.log('boardDetail: ', boardDetail);

    // 보드 멤버 저장
    await this.boardMemberRepository.save({
      board_id: boardDetail.id,
      user_id,
    });

    return { message: '보드 저장이 완료되었습니다.', board: { title: createBoardDto.title } };
  }

  // 보드 전체 조회(보드 멤버들만~)
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
