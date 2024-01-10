import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LexoRank } from 'lexorank';
import { BoardColumn } from 'src/board-column/entities/board-column.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(BoardColumn)
    private boardColumnRepository: Repository<BoardColumn>,
  ) {}
  async create(createCardDto: CreateCardDto, boardColumnId: number) {
    // 컬럼이 없으면 에러
    await this.findAllByColumnId(boardColumnId);

    const order = await this.getOrder(boardColumnId);

    return await this.cardRepository.save({
      title: createCardDto.title,
      content: createCardDto.content,
      dead_line: createCardDto.deadLine,
      priority: createCardDto.priority,
      order: order,
    });
  }

  async findAll() {
    const cards = await this.cardRepository.find();
    return cards.map((card) => {
      return {
        id: card.id,
        title: card.title,
        board_column_id: card.board_column_id,
        dead_line: card.dead_line,
        priority: card.priority,
        order: card.order,
      };
    });
  }

  async findAllByColumnId(boardColumnId: number) {
    const boardColumn = await this.boardColumnRepository.findOneBy({ id: boardColumnId });
    if (!boardColumn) throw new NotFoundException('해당 컬럼이 존재하지 않습니다.');

    const cards = await this.cardRepository.createQueryBuilder('card').where('card.board_column_id', { board_column_id: boardColumnId }).orderBy('card.order', 'ASC').getMany();

    return cards;
  }

  async findOne(boardColumnId: number, id: number) {
    await this.findAllByColumnId(boardColumnId);

    return await this.cardRepository.findOneBy({ id: id });
  }

  async update(boardColumnId: number, id: number, updateCardDto: UpdateCardDto) {
    await this.findAllByColumnId(boardColumnId);
    const card = await this.findOne(boardColumnId, id);

    const newOrder = await this.getNewOrder(boardColumnId, updateCardDto.index);
    console.log('newOrder >> ', newOrder);

    card.order = newOrder;

    Object.assign(card, updateCardDto);

    return await this.cardRepository.save(card);
  }

  async remove(boardColumnId: number, id: number) {
    return await this.cardRepository.delete({ id: id });
  }

  async getOrder(boardColumnId: number) {
    const cards = await this.cardRepository.findBy({ board_column_id: boardColumnId });
    if (!cards.length) {
      const order = LexoRank.middle().toString();
      return order;
    }
    const max = await this.cardRepository.createQueryBuilder('card').where('card.board_column_id', { board_column_id: boardColumnId }).orderBy('card.order', 'DESC').getOne();

    const order = LexoRank.parse(max.order).genNext().toString();
    return order;
  }

  async getNewOrder(boardColumnId: number, index: number) {
    const cards = await this.cardRepository.createQueryBuilder('card').where('card.board_column_id', { board_column_id: boardColumnId }).orderBy('card.order', 'ASC').getMany();

    // cards의 0번째 order의 앞순서가 최소lexorank보다 작거나 cards의 마지막 order의 다음순서가 최대lexorank보다 크면 재정렬하기
    if (LexoRank.parse(cards[0].order).genPrev() >= LexoRank.min() || LexoRank.parse(cards[cards.length - 1].order).genNext() <= LexoRank.max()) this.reOrdering(boardColumnId);

    // index가 cards의 길이보다 크면(이동하려는 위치가 마지막카드보다 뒤면) 가장 마지막 카드의 다음 순서로 order 지정
    if (index > cards.length - 1) {
      return LexoRank.parse(cards[cards.length - 1].order)
        .genNext()
        .toString();
    }

    // index가 0(가장 처음 위치)이면 aboveCard = null, index + 1이 마지막위치 이후면 belowCard = null
    const aboveCard = index > 0 ? cards[index] : null;
    const belowCard = index + 1 < cards.length - 1 ? cards[index + 1] : null;
    console.log('aboveCard >> ', aboveCard);
    console.log('belowCard >> ', belowCard);

    if (!aboveCard) return LexoRank.parse(belowCard.order).genPrev().toString();
    if (!belowCard) return LexoRank.parse(aboveCard.order).genNext().toString();

    const newOrder = LexoRank.parse(aboveCard.order).between(LexoRank.parse(belowCard.order)).toString();
    return newOrder;
  }

  async reOrdering(boardColumnId: number) {
    const cards = await this.cardRepository.createQueryBuilder('card').where('card.board_column_id', { board_column_id: boardColumnId }).orderBy('card.order', 'ASC').getMany();

    let newLexoRank = LexoRank.middle();
    for (let i = 0; i < cards.length; i++) {
      cards[i].order = newLexoRank.toString();
      newLexoRank = newLexoRank.genNext();
    }
  }
}
