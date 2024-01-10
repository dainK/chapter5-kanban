import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateBoardDto } from './dto/update-board.dto';

import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
  ) {}

  async create(user_id: number) {
    // 보드 정보 저장
    const boardDetail = await this.boardRepository.save({
      title: '새 보드',
      user_id,
    });

    // 보드 멤버 저장
    await this.boardMemberRepository.save({
      board_id: boardDetail.id,
      user_id,
      role: 0,
    });

    
    return { message: '보드 저장이 완료되었습니다.', board: { id: boardDetail.id, title: '새 보드' } };
  }

  // 보드 목록 조회(보드 멤버들만)
  async findAll(user_id: number) {
    // 로그인 한 사용자의 보드 목록 조회
    const boards = await this.boardRepository.createQueryBuilder('board').leftJoin('board.boardMember', 'boardMember').select(['board.id', 'board.title', 'board.user_id', 'boardMember.role']).where('boardMember.user_id = :user_id', { user_id }).getMany();
    return { boards };
  }

  // 보드 상세 조회
  async findOne(id: number, user_id: number) {
    const board = await this.findOneBoard(id); // 보드 정보 조회
    await this.checkBoardMember(id, user_id); // 로그인 한 사용자가 보드 멤버로 추가되어 있는지 확인
    return { board };
  }

  async update(id: number, updateBoardDto: UpdateBoardDto, user_id: number) {
    await this.findOneBoard(id); // 보드 정보 조회

    await this.checkBoardMemberRole(id, user_id); // 로그인 한 사용자의 role 조회

    // 보드 정보 업데이트
    const board = await this.boardRepository.update({ id }, { title: updateBoardDto.title });
    return { board: { title: updateBoardDto.title } };
  }

  async remove(id: number, user_id: number) {
    await this.findOneBoard(id); // 보드 정보 조회
    await this.checkBoardMemberRole(id, user_id); // 로그인 한 사용자의 role 조회

    // 보드 정보 삭제
    await this.boardRepository.delete({ id });
    return { message: '보드 삭제가 완료되었습니다.' };
  }

  // 제목 존재 여부 확인
  async findOneByTitle(title: string): Promise<Board | any> {
    const existingTitle = await this.boardRepository.findOne({ where: { title } });
    // ERR : 이미 제목이 존재할 경우
    if (existingTitle) {
      throw new ConflictException('이미 보드 제목이 존재합니다.');
    }
  }

  // 보드 존재 여부 확인
  async findOneBoard(id: number): Promise<Board | any> {
    const existingBoard = await this.boardRepository.findOne({ where: { id } });
    // ERR : 보드가 존재하지 않을 경우
    if (!existingBoard) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    return existingBoard;
  }

  // 로그인 한 사용자의 권한 확인
  async checkBoardMemberRole(id: number, user_id: number): Promise<Board | any> {
    // role이 0(Admin) 또는 1(Editor) 일 때 수정/삭제 가능
    // join문으로 처리해야하남? - 이아영
    const existingBoardMember = await this.boardMemberRepository.findOne({
      where: [
        { board_id: id, user_id, role: 0 },
        { board_id: id, user_id, role: 1 },
      ],
    });

    // ERR : role가 0(Admin), 1(Editor)이 아닌 경우
    if (!existingBoardMember) {
      throw new UnauthorizedException('권한이 존재하지 않습니다.');
    }
  }

  // 로그인 한 사용자가 보드 멤버로 추가되어 있는지 확인
  async checkBoardMember(id: number, user_id: number): Promise<Board | any> {
    // join문으로 처리해야하남? - 이아영
    const existingBoardMember = await this.boardMemberRepository.findOne({
      where: { board_id: id, user_id },
    });

    // ERR : 포함된 보드가 존재하지 않을 경우
    if (!existingBoardMember) {
      throw new UnauthorizedException('권한이 존재하지 않습니다.');
    }
  }
}
