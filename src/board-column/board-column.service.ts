import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';

import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumn } from 'src/board-column/entities/board-column.entity';
import { Board } from 'src/board/entities/board.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';

@Injectable()
export class BoardColumnService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardColumn)
    private readonly boardColumnRepository: Repository<BoardColumn>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
  ) {}
  async create(createBoardColumnDto: CreateBoardColumnDto, board_id: number, user_id: number) {
    // 보드 조회
    const existingBoard = await this.boardRepository.findOne({ where: { id: board_id } });

    // ERR : 보드가 존재하지 않을 경우
    if (!existingBoard) {
      throw new ConflictException('보드가 존재하지 않습니다.');
    }

    // 제목 조회
    const existingColumnTitle = await this.boardColumnRepository.findOne({
      where: { title: createBoardColumnDto.title },
    });

    // ERR : 이미 제목이 존재할 경우
    if (existingColumnTitle) {
      throw new ConflictException('이미 칼럼 제목이 존재합니다.');
    }

    // 칼럼 정보 저장
    const boardColum = await this.boardColumnRepository.save({
      board_id,
      title: createBoardColumnDto.title,
    });

    return { message: '칼럼 저장이 완료되었습니다.', boardColum };
  }

  // 특정 보드의 칼럼 전체 조회(칼럼 멤버들만~)
  async findAll(board_id: number, user_id: number) {
    // 보드 조회
    const existingBoard = await this.boardRepository.findOne({
      where: { id: board_id },
    });

    // ERR : 보드가 존재하지 않을 경우
    if (!existingBoard) {
      throw new ConflictException('보드가 존재하지 않습니다.');
    }

    // 로그인 한 사용자가 소유된 보드들 조회
    const exsitingBoard = await this.boardMemberRepository.findOne({ where: { board_id, user_id } });

    // ERR : 포함된 보드가 존재가 하지 않을 경우
    if (!exsitingBoard) {
      throw new NotFoundException('권한이 없습니다.');
    }

    // 칼럼 목록 조회
    const columns = await this.boardColumnRepository.find({ where: { board_id } });

    // ERR : 포함된 보드가 존재가 하지 않을 경우
    if (!columns) {
      throw new NotFoundException('칼럼이 존재하지 않습니다.');
    }

    return { columns };
  }

  // 하나씩은 조회할 필요가.. 없던가..?
  async findOne(id: number, board_id: number, user_id: number) {
    // 보드 조회
    const existingBoard = await this.boardRepository.findOne({
      where: { id: board_id },
    });

    // ERR : 보드가 존재하지 않을 경우
    if (!existingBoard) {
      throw new ConflictException('보드가 존재하지 않습니다.');
    }

    // 로그인 한 사용자가 소유된 보드들 조회
    const exsitingBoard = await this.boardMemberRepository.findOne({ where: { board_id, user_id } });

    // ERR : 포함된 보드가 존재가 하지 않을 경우
    if (!exsitingBoard) {
      throw new NotFoundException('권한이 없습니다.');
    }

    // 칼럼 상세 조회
    const column = await this.boardColumnRepository.findOne({ where: { id } });
    console.log('column: ', column);

    // ERR : 포함된 칼럼이 존재가 하지 않을 경우
    if (_.isNil(column)) {
      throw new NotFoundException('칼럼이 존재하지 않습니다.');
    }

    return { column };
  }

  async update(id: number, updateBoardColumnDto: UpdateBoardColumnDto, board_id: number, user_id: number) {
    // 보드 조회
    const existingBoard = await this.boardRepository.findOne({
      where: { id: board_id },
    });

    // ERR : 보드가 존재하지 않을 경우
    if (!existingBoard) {
      throw new ConflictException('보드가 존재하지 않습니다.');
    }

    // 로그인 한 사용자가 소유된 보드들 조회
    const exsitingBoard = await this.boardMemberRepository.findOne({ where: { board_id, user_id } });

    // ERR : 포함된 보드가 존재가 하지 않을 경우
    if (!exsitingBoard) {
      throw new NotFoundException('권한이 없습니다.');
    }

    // 조회하려는 칼럼에 로그인 한 사용자가 멤버로 추가되어 있는지 검사
    // role이 0(Admin) 또는 1(Editor) 일 때 가능
    // join문으로 처리해야하남? - 이아영
    const checkBoardMemberRole = await this.boardMemberRepository.findOne({
      where: [
        { id, user_id, role: 0 },
        { id, user_id, role: 1 },
      ],
    });

    // ERR : viewer일 경우
    if (!checkBoardMemberRole) {
      throw new UnauthorizedException('권한이 존재하지 않습니다.');
    }

    // 칼럼 업데이트
    const column = await this.boardColumnRepository.update({ id }, { title: updateBoardColumnDto.title });
    return { column: { title: updateBoardColumnDto.title } };
  }

  async remove(id: number, board_id: number, user_id: number) {
    // 칼럼 상세 조회
    const existingBoard = await this.boardRepository.findOne({
      where: { id: board_id },
    });

    // ERR : 칼럼가 존재하지 않을 경우
    if (!existingBoard) {
      throw new NotFoundException('칼럼가 존재하지 않습니다.');
    }

    // 조회하려는 칼럼에 로그인 한 사용자가 멤버로 추가되어 있는지 검사
    // role이 0(Admin) 또는 1(Editor) 일 때 가능
    // join문으로 처리해야하남? - 이아영
    const checkBoardMemberRole = await this.boardMemberRepository.findOne({
      where: [
        { id, user_id, role: 0 },
        { id, user_id, role: 1 },
      ],
    });

    // ERR : viewer일 경우
    if (!checkBoardMemberRole) {
      throw new UnauthorizedException('권한이 존재하지 않습니다.');
    }

    const column = await this.boardColumnRepository.delete({ id });
    return { message: '칼럼 삭제가 완료되었습니다.' };
  }
}
