import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { Board } from 'src/board/entities/board.entity';

@Injectable()
export class BoardMemberService {
  constructor(
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(board_id: number, user_id: number, select_user_id: number, role: number) {
    // 보드 존재 여부 확인
    const existingBoard = await this.findBoard(board_id);
    if (!existingBoard) {
      throw new ConflictException('보드가 존재하지 않습니다.');
    }

    // 로그인 한 사용자의 권한 조회
    const checkBoardMemberRole = await this.findBoardMember(board_id, user_id);

    // ERR : role이 0(Admin) 또는 1(Editor)이 아닌 경우
    if (!checkBoardMemberRole) {
      throw new NotFoundException('권한이 없습니다.');
    }

    // 보드 멤버 조회
    const existingBoardMember = await this.findBoardMember(board_id, select_user_id);
    if (existingBoardMember) {
      throw new ConflictException('이미 등록된 멤버입니다.');
    }

    // 칼럼 정보 저장
    const boardMember = await this.boardMemberRepository.save({
      board_id,
      user_id: select_user_id,
      role,
    });

    return { message: '보드 멤버 추가가 완료되었습니다.' };
  }

  async findAll(board_id: number) {
    // 보드 존재 여부 확인
    const existingBoard = await this.findBoard(board_id);
    if (!existingBoard) {
      throw new ConflictException('보드가 존재하지 않습니다.');
    }

    // 보드 멤버 목록 조회
    const boardMembers = await this.boardMemberRepository.find({ where: { board_id } });
    if (_.isNil(boardMembers)) {
      throw new NotFoundException('멤버가 존재하지 않습니다.');
    }

    return { boardMembers };
  }

  async findOne(id: number, board_id: number) {
    // 보드 존재 여부 확인
    const existingBoard = await this.findBoard(board_id);
    if (!existingBoard) {
      throw new ConflictException('보드가 존재하지 않습니다.');
    }

    // 회원정보 조회
    // join문으로 이메일, 이름 가져오는 기능 추가하기!!!!!!
    const boardMember = await this.boardMemberRepository.findOne({
      where: { id, board_id },
    });

    // ERR : 포함된 보드가 존재하지 않을 경우
    if (!boardMember) {
      throw new NotFoundException('멤버가 존재하지 않습니다.');
    }

    return { boardMember };
  }

  async update(id: number, board_id: number, user_id: number, select_user_id: number, role: number) {
    // 보드 존재 여부 확인
    const existingBoard = await this.findBoard(board_id);
    if (!existingBoard) {
      throw new ConflictException('보드가 존재하지 않습니다.');
    }

    // 로그인 한 사용자의 권한 조회
    const checkBoardMemberRole = await this.findBoardMember(board_id, user_id);

    // ERR : role이 0(Admin) 또는 1(Editor)이 아닌 경우
    if (!checkBoardMemberRole) {
      throw new NotFoundException('권한이 없습니다.');
    }

    // 보드 멤버 업데이트
    const board = await this.boardMemberRepository.update({ board_id, user_id: select_user_id }, { role });
    return { message: '권한 수정이 완료되었습니다.' };
  }

  async remove(id: number, board_id: number, user_id: number, select_user_id: number) {
    // 보드 존재 여부 확인
    const existingBoard = await this.findBoard(board_id);
    if (!existingBoard) {
      throw new ConflictException('보드가 존재하지 않습니다.');
    }

    // 로그인 한 사용자의 권한 조회
    const checkBoardMemberRole = await this.findBoardMember(board_id, user_id);

    // ERR : role이 0(Admin) 또는 1(Editor)이 아닌 경우
    if (!checkBoardMemberRole) {
      throw new NotFoundException('권한이 없습니다.');
    }

    // ERR : 삭제하려는 멤버의 role이 0(Admin)인 경우
    if (checkBoardMemberRole.role === 0) {
      throw new NotFoundException('Admin은 삭제할 수 없습니다.');
    }

    // 보드 멤버 삭제
    await this.boardMemberRepository.delete({ board_id, user_id: select_user_id });
    return { message: '보드 멤버 삭제가 완료되었습니다.' };
  }

  // 보드 존재 여부 조회
  async findBoard(board_id: number): Promise<Board | undefined> {
    return this.boardRepository.findOne({ where: { id: board_id } });
  }

  // 보드 멤버 권한 조회
  async findBoardMember(board_id: number, user_id: number) {
    return this.boardMemberRepository.findOne({ where: { board_id, user_id } });
  }
}
