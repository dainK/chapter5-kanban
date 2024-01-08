import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LexoRank } from 'lexorank';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}
  async create(createCardDto: CreateCardDto) {
    const order = await this.getOrder(createCardDto.boardColumnId);

    return await this.cardRepository.save({
      user_id: createCardDto.userId,
      board_column_id: createCardDto.boardColumnId,
      title: createCardDto.title,
      content: createCardDto.content,
      dead_line: createCardDto.deadLine,
      priority: createCardDto.priority,
      order: order,
    });
  }

  async getOrder(boardColumnId: number) {
    const cards = await this.cardRepository.findBy({ board_column_id: boardColumnId });
    if (!cards) {
      const order = LexoRank.middle().toString();
      return order;
    }
    let max = LexoRank.min().toString();
    cards.map((card) => {
      if (max <= card.order) max = card.order;
      const order = LexoRank.parse(max).genNext().toString();
      return order;
    });
  }

  async findAll() {
    const cards = await this.cardRepository.find();
    return cards.map((card) => {
      return {
        id: card.id,
        title: card.title,
        board_column_id: card.board_column_id,
        user_id: card.user_id,
        dead_line: card.dead_line,
        priority: card.priority,
        order: card.order,
      };
    });
  }

  async findOne(id: number) {
    return await this.cardRepository.findOneBy({ id: id });
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    const newOrder = await this.getNewOrder(updateCardDto.boardColumnId, updateCardDto.index);
    await this.cardRepository.update({ id: id }, { order: newOrder });

    return await this.cardRepository.update({ id: id }, updateCardDto);
  }

  async getNewOrder(boardColumnId: number, index: number) {
    const cards = await this.cardRepository.createQueryBuilder('card').where('card.board_column_id = boardColumnId', { boardColumnId }).orderBy('card.order', 'ASC').getMany();

    const aboveCard = cards[index];
    const belowCard = cards[index + 1];

    if (!aboveCard) {
      const aboveOrder = LexoRank.parse(belowCard.order);
      if (aboveOrder === LexoRank.min()) this.reOrdering(boardColumnId);
      return aboveOrder.genPrev().toString();
    }

    if (!belowCard) {
      const belowOrder = LexoRank.parse(aboveCard.order);
      if (belowOrder === LexoRank.max()) this.reOrdering(boardColumnId);
      return belowOrder.genNext().toString();
    }

    const newOrder = LexoRank.parse(aboveCard.order).between(LexoRank.parse(belowCard.order)).toString();
    return newOrder;
  }

  async reOrdering(boardColumnId) {
    const cards = await this.cardRepository.createQueryBuilder('card').where('card.board_column_id = boardColumnId', { boardColumnId }).orderBy('card.order', 'ASC').getMany();

    let newLexoRank = LexoRank.middle();
    for (let i = 0; i < cards.length; i++) {
      cards[i].order = newLexoRank.toString();
      newLexoRank = newLexoRank.genNext();
    }
  }

  async remove(id: number) {
    return await this.cardRepository.delete({ id: id });
  }
}
