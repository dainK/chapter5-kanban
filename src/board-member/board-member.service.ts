import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import _ from 'lodash';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { Board } from 'src/board/entities/board.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BoardMemberService {
  constructor(
    @InjectRepository(BoardMember)
    private readonly boardMemberRepository: Repository<BoardMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(board_id: number, user_id: number, select_user_id: number, role: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMemberRole(board_id, user_id); // 로그인 한 사용자의 role 조회

    const existingBoardMember = await this.findBoardMember(board_id, select_user_id); // 보드 멤버 조회
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

  async findAll(board_id: number, user_id: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMember(board_id, user_id); // 보드 멤버 조회

    // 보드 멤버 목록 조회
    const boardMembers = await this.userRepository.createQueryBuilder('user').leftJoin('user.boardMember', 'boardMember').select(['user.id', 'user.email', 'user.name', 'boardMember.role']).where('boardMember.board_id = :board_id', { board_id }).orderBy('boardMember.role', 'ASC').getMany();

    return { boardMembers };
  }

  async searchAll(board_id: number, user_id: number, memberKeyword: string) {
    console.log('memberKeyword: ', memberKeyword);
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMember(board_id, user_id); // 보드 멤버 조회

    // 보드 멤버 목록 조회
    const boardMembers = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.boardMember', 'boardMember')
      .select(['user.id', 'user.email', 'user.name', 'boardMember.role'])
      .where('boardMember.board_id = :board_id', { board_id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.name LIKE :keywordPattern', { keywordPattern: `%${memberKeyword}%` }).orWhere('user.email LIKE :keywordPattern', { keywordPattern: `%${memberKeyword}%` });
        }),
      )
      .orderBy('boardMember.role', 'ASC')
      .getMany();

    return { boardMembers };
  }

  async findOne(board_id: number, user_id: number, select_user_id: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMember(board_id, user_id); // 보드 멤버 조회

    const boardMember = await this.userRepository.createQueryBuilder('user').leftJoin('user.boardMember', 'boardMember').select(['user.email', 'user.name', 'user.role']).where('user.id = :user_id', { user_id }).getOne();
    if (!boardMember) {
      throw new ConflictException('멤버가 등록되지 않았습니다.');
    }

    return { boardMember };
  }

  async update(board_id: number, user_id: number, select_user_id: number, role: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMemberRole(board_id, user_id); // 로그인 한 사용자의 role 조회
    const boardMember = await this.findBoardMember(board_id, select_user_id); // 보드 멤버 조회
    if (!boardMember) {
      throw new ConflictException('멤버가 등록되지 않았습니다.');
    }
    // ERR : 삭제하려는 멤버의 role이 0(Admin)인 경우
    if (boardMember.role === 0) {
      throw new NotFoundException('Admin은 수정할 수 없습니다.');
    }
    // 보드 멤버 업데이트
    await this.boardMemberRepository.update({ board_id, user_id: select_user_id }, { role });
    return { message: '권한 수정이 완료되었습니다.' };
  }

  async remove(board_id: number, user_id: number, select_user_id: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMemberRole(board_id, user_id); // 로그인 한 사용자의 role 조회

    const boardMember = await this.findBoardMember(board_id, select_user_id); // 보드 멤버 조회
    if (!boardMember) {
      throw new ConflictException('멤버가 등록되지 않았습니다.');
    }
    // ERR : 삭제하려는 멤버의 role이 0(Admin)인 경우
    if (boardMember.role === 0) {
      throw new NotFoundException('Admin은 삭제할 수 없습니다.');
    }

    // 보드 멤버 삭제
    await this.boardMemberRepository.delete({ board_id, user_id: select_user_id });
    return { message: '보드 멤버 삭제가 완료되었습니다.' };
  }

  // 보드 존재 여부 확인
  async findOneBoard(board_id: number): Promise<Board | any> {
    const existingBoard = await this.boardRepository.findOne({ where: { id: board_id } });
    // ERR : 보드가 존재하지 않을 경우
    if (!existingBoard) {
      throw new NotFoundException('보드가 존재하지 않습니다.');
    }
    return existingBoard;
  }

  // 보드 멤버 권한 조회
  async findBoardMember(board_id: number, user_id: number) {
    return this.boardMemberRepository.findOne({ where: { board_id, user_id } });
  }

  // 보드 멤버 여부 조회
  async checkBoardMember(board_id: number, user_id: number): Promise<BoardMember | any> {
    const exsitingBoardMember = await this.boardMemberRepository.findOne({ where: { board_id, user_id } });

    // ERR : 보드 멤버가 아닌 경우
    if (!exsitingBoardMember) {
      throw new NotFoundException('권한이 없습니다.');
    }
  }

  // 로그인 한 사용자의 권한 확인
  async checkBoardMemberRole(board_id: number, user_id: number): Promise<Board | any> {
    // role이 0(Admin) 또는 1(Editor) 일 때 수정/삭제 가능
    // join문으로 처리해야하남? - 이아영
    const existingBoardMember = await this.boardMemberRepository.findOne({
      where: [
        { board_id, user_id, role: 0 },
        { board_id, user_id, role: 1 },
      ],
    });

    // ERR : role가 0(Admin), 1(Editor)이 아닌 경우
    if (!existingBoardMember) {
      throw new UnauthorizedException('권한이 존재하지 않습니다.');
    }

    return existingBoardMember;
  }
}
