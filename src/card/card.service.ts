import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  async create(createCardDto: CreateCardDto, userId: number) {
    const order = await this.getOrder(createCardDto.boardColumnId);

    return await this.cardRepository.save({
      board_member_id: userId,
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
        board_member_id: card.board_member_id,
        dead_line: card.dead_line,
        priority: card.priority,
        order: card.order,
      };
    });
  }

  async findOne(id: number) {
    return await this.cardRepository.findOneBy({ id: id });
  }

  async update(id: number, updateCardDto: UpdateCardDto, userId: number) {
    const card = await this.findOne(id);
    if (card.board_member_id !== userId) throw new UnauthorizedException('담당자만 수정 가능합니다.');

    return await this.cardRepository.update({ id: id }, updateCardDto);
  }

  async remove(id: number, userId: number) {
    const card = await this.findOne(id);
    if (card.board_member_id !== userId) throw new UnauthorizedException('담당자만 삭제 가능합니다.');

    return await this.cardRepository.delete({ id: id });
  }
}
