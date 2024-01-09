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
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMember(board_id, user_id); // 보드 멤버 조회
    await this.findOneByTitle(createBoardColumnDto.title); // 제목 중복 여부 체크

    // 칼럼 정보 저장
    const boardColum = await this.boardColumnRepository.save({
      board_id,
      title: createBoardColumnDto.title,
    });

    return { message: '칼럼 저장이 완료되었습니다.', boardColum };
  }

  // 특정 보드의 칼럼 전체 조회(보드 멤버들만~)
  async findAll(board_id: number, user_id: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMember(board_id, user_id); // 보드 멤버 조회

    // 칼럼 목록 조회
    const columns = await this.boardColumnRepository.find({ where: { board_id } });

    // ERR : 칼럼이 없는 경우
    if (!columns) {
      throw new NotFoundException('칼럼이 존재하지 않습니다.');
    }

    return { columns };
  }

  // 칼럼 상세 조회
  async findOne(id: number, board_id: number, user_id: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMember(board_id, user_id); // 보드 멤버 조회
    const column = await this.findOneColumn(id); // 칼럼 상세 조회

    return { column };
  }

  async update(id: number, updateBoardColumnDto: UpdateBoardColumnDto, board_id: number, user_id: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMember(board_id, user_id); // 보드 멤버 조회
    await this.findOneColumn(id); // 칼럼 상세 조회
    await this.checkBoardMemberRole(board_id, user_id); // 로그인 한 사용자의 role 조회
    await this.findOneByTitle(updateBoardColumnDto.title); // 제목 중복 여부 체크

    // 칼럼 업데이트
    await this.boardColumnRepository.update({ id }, { title: updateBoardColumnDto.title });
    return { column: { title: updateBoardColumnDto.title } };
  }

  async remove(id: number, board_id: number, user_id: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.findOneColumn(id); // 칼럼 상세 조회
    await this.checkBoardMemberRole(board_id, user_id); // 로그인 한 사용자의 role 조회

    // 칼럼 삭제
    await this.boardColumnRepository.delete({ id });
    return { message: '칼럼 삭제가 완료되었습니다.' };
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

  // 제목 존재 여부 확인
  async findOneByTitle(title: string): Promise<Board | any> {
    const existingTitle = await this.boardColumnRepository.findOne({ where: { title } });
    // ERR : 이미 제목이 존재할 경우
    if (existingTitle) {
      throw new ConflictException('이미 보드 제목이 존재합니다.');
    }
  }

  // 보드 멤버 여부 조회
  async checkBoardMember(board_id: number, user_id: number): Promise<BoardMember | any> {
    const exsitingBoardMember = await this.boardMemberRepository.findOne({ where: { board_id, user_id } });

    // ERR : 보드 멤버가 아닌 경우
    if (!exsitingBoardMember) {
      throw new NotFoundException('권한이 없습니다.');
    }
  }

  // 칼럼 존재 여부 확인
  async findOneColumn(id: number): Promise<BoardColumn | any> {
    const existingColumn = await this.boardColumnRepository.findOne({ where: { id } });
    // ERR : 칼럼이 존재하지 않을 경우
    if (!existingColumn) {
      throw new NotFoundException('칼럼이 존재하지 않습니다.');
    }

    return existingColumn;
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
  }
}
