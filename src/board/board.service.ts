import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
      role: 0,
    });

    return { message: '보드 저장이 완료되었습니다.', board: { title: createBoardDto.title } };
  }

  // 보드 전체 조회(보드 멤버들만~)
  async findAll(user_id: number) {
    // 로그인 한 사용자가 소유된 보드들 조회
    const board = await this.boardRepository.find({ where: { user_id } });

    // ERR : 포함된 보드가 존재하지 않을 경우
    if (!board) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }

    return { board };
  }

  // 하나씩은 조회할 필요가.. 없던가..?
  async findOne(id: number, user_id: number) {
    // 보드 상세 조회
    const board = await this.boardRepository.findOne({
      where: { id },
    });

    // ERR : 보드가 존재하지 않을 경우
    if (!board) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }

    // 조회하려는 보드에 로그인 한 사용자가 멤버로 추가되어 있는지 검사
    // join문으로 처리해야하남? - 이아영
    const existingBoardMember = await this.boardMemberRepository.findOne({
      where: { id, user_id },
    });

    // ERR : 포함된 보드가 존재하지 않을 경우
    if (!existingBoardMember) {
      throw new UnauthorizedException('권한이 존재하지 않습니다.');
    }

    return { board };
  }

  async update(id: number, updateBoardDto: UpdateBoardDto, user_id: number) {
    // 보드 상세 조회
    const existingBoard = await this.boardRepository.findOne({
      where: { id },
    });

    // ERR : 보드가 존재하지 않을 경우
    if (!existingBoard) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }

    // 조회하려는 보드에 로그인 한 사용자가 멤버로 추가되어 있는지 검사
    // role이 0(Admin) 또는 1(Editor) 일 때 가능
    // join문으로 처리해야하남? - 이아영
    const existingBoardMember = await this.boardMemberRepository.findOne({
      where: [
        { id, user_id, role: 0 },
        { id, user_id, role: 1 },
      ],
    });

    // ERR : 포함된 보드가 존재하지 않을 경우
    if (!existingBoardMember) {
      throw new UnauthorizedException('권한이 존재하지 않습니다.');
    }

    // 보드 업데이트
    const board = await this.boardRepository.update({ id }, { title: updateBoardDto.title });
    return { board: { title: updateBoardDto.title } };
  }

  async remove(id: number, user_id: number) {
    console.log('id: ', id);
    // 보드 상세 조회
    const existingBoard = await this.boardRepository.findOne({
      where: { id },
    });

    // ERR : 보드가 존재하지 않을 경우
    if (!existingBoard) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }

    // 조회하려는 보드에 로그인 한 사용자가 멤버로 추가되어 있는지 검사
    // role이 0(Admin) 또는 1(Editor) 일 때 가능
    // join문으로 처리해야하남? - 이아영
    const existingBoardMember = await this.boardMemberRepository.findOne({
      where: [
        { id, user_id, role: 0 },
        { id, user_id, role: 1 },
      ],
    });

    // ERR : 포함된 보드가 존재하지 않을 경우
    if (!existingBoardMember) {
      throw new UnauthorizedException('권한이 존재하지 않습니다.');
    }

    const board = await this.boardRepository.delete({ id });
    return { message: '보드 삭제가 완료되었습니다.' };
  }
}
