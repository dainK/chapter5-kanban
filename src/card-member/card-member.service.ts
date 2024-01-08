import { Injectable } from '@nestjs/common';
import { CreateCardMemberDto } from './dto/create-card-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CardMember } from './entities/card-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardMemberService {
  constructor(
    @InjectRepository(CardMember)
    private cardMemberRepository: Repository<CardMember>,
  ) {}

  async create(createCardMemberDto: CreateCardMemberDto) {
    return await this.cardMemberRepository.save({
      card_id: createCardMemberDto.cardId,
      user_id: createCardMemberDto.userId,
    });
  }

  async findAllByUserId(userId: number) {
    const cards = await this.cardMemberRepository.findBy({ user_id: userId });

    return cards.map((card) => {
      return {
        card_id: card.card_id,
      };
    });
  }

  async findAllByCardId(cardId: number) {
    const users = await this.cardMemberRepository.findBy({ card_id: cardId });

    return users.map((user) => {
      return {
        user_id: user.user_id,
      };
    });
  }

  async remove(id: number) {
    return await this.cardMemberRepository.delete(id);
  }
}
