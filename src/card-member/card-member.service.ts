import { Injectable } from '@nestjs/common';
import { CreateCardMemberDto } from './dto/create-card-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CardMember } from './entities/card-member.entity';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { BoardColumn } from 'src/board-column/entities/board-column.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { Repository, getRepository } from 'typeorm';

@Injectable()
export class CardMemberService {
  constructor(
    @InjectRepository(CardMember)
    private cardMemberRepository: Repository<CardMember>,
    @InjectRepository(BoardMember)
    private boardMemberRepository: Repository<BoardMember>,
    @InjectRepository(Card)
    private boardColumnRepository: Repository<BoardColumn>,
    @InjectRepository(BoardColumn)
    private cardRepository: Repository<Card>,
  ) {}

  async create(createCardMemberDto: CreateCardMemberDto) {
    return await this.cardMemberRepository.save({
      card_id: createCardMemberDto.cardId,
      board_member_id: createCardMemberDto.userId,
    });
  }

  // 카드 멤버에 속한 않은 보드 멤버 전체 조회
  async findAllCardMember(cardId: number) {
    console.log('cardId: ', cardId);
    // card를 소유한 Board의 id 조회
    const boardColumnResult = await this.cardRepository.createQueryBuilder('card').select('card.board_column_id', 'boardId').where('card.id = :cardId', { cardId }).getRawOne();

    // boardColumnResult에서 boardId 값을 추출해야 합니다.
    const boardId = boardColumnResult.boardId;
    console.log('boardId: ', boardId);

    // boardId를 사용하여 board_member 조회
    const boardMembers = await this.boardMemberRepository.createQueryBuilder('board_member').leftJoinAndSelect('board_member.user', 'user').leftJoin('card_member', 'card_member', 'board_member.user_id = card_member.board_member_id AND card_member.card_id = :cardId', { cardId }).where('board_member.board_id = :boardId', { boardId }).select(['user.id', 'user.email', 'user.name']).getRawMany();

    return { boardMembers };
  }

  // 카드 멤버에 속하지 않은 보드 멤버 전체 조회
  async findAll(cardId: number) {
    console.log('cardId: ', cardId);
    // card를 소유한 Board의 id 조회
    const boardColumnId = await this.cardRepository.findOne({ select: ['board_column_id'], where: { id: +cardId } });
    // const boardColumnId = await this.cardRepository.createQueryBuilder('card').select('board_column_id').where('id = :cardId', { cardId }).getOne();
    console.log('boardColumnId: ', boardColumnId);
    const boardId = await this.boardColumnRepository.findOne({ select: ['board_id'], where: { id: +boardColumnId } });

    // const boardId = await this.boardColumnRepository.createQueryBuilder('board_column').select('board_id').where('id = :boardColumnId', { boardColumnId }).getOne();
    console.log('boardId: ', boardId);
    // boardColumnResult에서 boardId 값을 추출해야 합니다.
    console.log('boardId: ', boardId);

    // boardId를 사용하여 board_member 조회
    const boardMembers = await this.boardMemberRepository
      .createQueryBuilder('board_member')
      .leftJoinAndSelect('board_member.user', 'user')
      .leftJoin('card_member', 'card_member', 'board_member.user_id = card_member.board_member_id AND card_member.card_id = :cardId', { cardId })
      .where('board_member.board_id = :boardId', { boardId })
      .andWhere('card_member.board_member_id IS NULL')
      // .andWhere('card_member.card_id = :cardId', { cardId })
      .select(['user.id', 'user.email', 'user.name'])
      .getRawMany();

    return { boardMembers };
  }

  // 카드 멤버에 속하지 않은 보드 멤버 검색 조회
  // async searchAll(cardId: number, serachKeyword: string) {
  //   const boardMembers = await this.cardMemberRepository
  //     .createQueryBuilder('bm')
  //     .leftJoinAndSelect('bm.user', 'u')
  //     .leftJoin(CardMember, 'cm', 'bm.id = cm.board_member_id AND cm.card_id = :cardId', { cardId })
  //     .select(['bm.*', 'u.email', 'u.name'])
  //     .where('bm.board_id = :boardId', {
  //       boardId: () => getRepository(Card).createQueryBuilder('c').select('c.board_column_id').where('c.id = :cardId', { cardId }).getQuery(),
  //     })
  //     .andWhere('cm.id IS NULL')
  //     .setParameter('cardId', cardId)
  //     .getMany();
  // }

  async findAllByUserId(userId: number) {
    const cards = await this.cardMemberRepository.findBy({ board_member_id: userId });

    return cards.map((card) => {
      return {
        card_id: card.card_id,
      };
    });
  }

  async findAllByCardId(cardId: number) {
    const members = await this.cardMemberRepository.findBy({ card_id: cardId });

    return members.map((member) => {
      return {
        board_member_id: member.board_member_id,
      };
    });
  }

  async remove(id: number) {
    return await this.cardMemberRepository.delete(id);
  }
}
