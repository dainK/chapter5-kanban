import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardColumn } from 'src/board-column/entities/board-column.entity';
import { Board } from 'src/board/entities/board.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { LexoRank } from 'lexorank';

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
    const order = await this.getOrder(board_id); // 칼럼 생성 시 정렬 순서 저장

    // 칼럼 정보 저장
    const boardColum = await this.boardColumnRepository.save({
      board_id,
      title: createBoardColumnDto.title,
      order,
    });

    return { message: '칼럼 저장이 완료되었습니다.', boardColum };
  }

  // 특정 보드의 칼럼, 카드 전체 조회(보드 멤버들만~)
  async findAll(board_id: number, user_id: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMember(board_id, user_id); // 보드 멤버 조회

    // 칼럼, 카드 목록 조회
    const columns = await this.boardColumnRepository
      .createQueryBuilder('boardColumn')
      .leftJoinAndSelect('boardColumn.card', 'card') // 'cards'는 BoardColumn 엔티티 내에 정의된 관계의 이름이어야 합니다.
      .where('boardColumn.board_id = :boardId', { boardId: board_id })
      .orderBy('boardColumn.order', 'ASC')
      .getMany();
    return { columns };
  }

  // 칼럼 상세 조회
  async findOne(id: number, board_id: number, user_id: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMember(board_id, user_id); // 보드 멤버 조회
    await this.findOneColumn(id); // 칼럼 상세 조회

    return await this.boardColumnRepository.findOneBy({ id });
  }

  async update(id: number, updateBoardColumnDto: UpdateBoardColumnDto, board_id: number, user_id: number) {
    await this.findOneBoard(board_id); // 보드 정보 조회
    await this.checkBoardMember(board_id, user_id); // 보드 멤버 조회
    await this.checkBoardMemberRole(board_id, user_id); // 로그인 한 사용자의 role 조회
    const boardColumn = await this.findOne(id, board_id, user_id); // 칼럼 상세 조회

    // index 안받으면 newOrder 함수 안들어가게
    if (updateBoardColumnDto.index !== null) {
      const newOrder = await this.getNewOrder(board_id, updateBoardColumnDto.index);
      boardColumn.order = newOrder;
    }

    // 칼럼 업데이트
    Object.assign(boardColumn, updateBoardColumnDto);
    return await this.boardColumnRepository.save(boardColumn);
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

  async getOrder(board_id: number) {
    const boardColums = await this.boardColumnRepository.findBy({ board_id: board_id });
    if (!boardColums.length) {
      const order = LexoRank.middle().toString();
      return order;
    }
    const max = await this.boardColumnRepository.findOne({ where: { board_id }, order: { order: 'DESC' } });

    const order = LexoRank.parse(max.order).genNext().toString();
    return order;
  }

  async getNewOrder(board_id: number, index: number) {
    const boardColums = await this.boardColumnRepository.find({ where: { board_id }, order: { order: 'ASC' } });

    console.log('COLUMN LENGTH', boardColums.length, 'INDEX', index);

    // boardColums의 0번째 order의 앞순서가 최소lexorank보다 작거나 boardColums의 마지막 order의 다음순서가 최대lexorank보다 크면 재정렬하기
    if (LexoRank.parse(boardColums[0].order).genPrev() <= LexoRank.min() || LexoRank.parse(boardColums[boardColums.length - 1].order).genNext() >= LexoRank.max()) this.reOrdering(board_id);

    // index가 boardColums의 길이보다 크면(이동하려는 위치가 마지막카드보다 뒤면) 가장 마지막 카드의 다음 순서로 order 지정
    if (index > boardColums.length - 1) {
      return LexoRank.parse(boardColums[boardColums.length - 1].order)
        .genNext()
        .toString();
    }

    // index가 0(가장 처음 위치)이면 prevColumn = null, index + 1이 마지막위치 이후면 nextColumn = null
    let prevColumn: BoardColumn;
    let nextColumn: BoardColumn;

    if (index === 0) {
      prevColumn = null;
      nextColumn = boardColums[0];
    } else if (index === boardColums.length - 1) {
      prevColumn = boardColums[boardColums.length - 1];
      nextColumn = null;
    } else {
      prevColumn = boardColums[index];
      nextColumn = boardColums[index + 1];
    }

    console.log('prevColumn >> ', prevColumn);
    console.log('nextColumn >> ', nextColumn);

    if (!prevColumn) return LexoRank.parse(nextColumn.order).genPrev().toString();
    if (!nextColumn) return LexoRank.parse(prevColumn.order).genNext().toString();

    const newOrder = LexoRank.parse(prevColumn.order).between(LexoRank.parse(nextColumn.order)).toString();
    return newOrder;
  }

  async reOrdering(board_id: number) {
    const boardColums = await this.boardColumnRepository.find({ where: { board_id }, order: { order: 'ASC' } });

    let newLexoRank = LexoRank.middle();
    for (let i = 0; i < boardColums.length; i++) {
      boardColums[i].order = newLexoRank.toString();
      newLexoRank = newLexoRank.genNext();
    }
    return await this.boardColumnRepository.save(boardColums);
  }
}
