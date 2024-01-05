import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card)
        private cardRepository: Repository<Card>,
    ) {}
    async create(createCardDto: CreateCardDto, userId: number) {
        return await this.cardRepository.save({
            board_member_id: userId,
            title: createCardDto.title,
            content: createCardDto.content,
            dead_line: createCardDto.deadLine,
            priority: createCardDto.priority,
        });
    }

    async findAll() {
      const cards = await this.cardRepository.find();
        return cards.map ((card) => {
          title:card.title,

        })
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} card`;
    }

    update(id: number, updateCardDto: UpdateCardDto, userId: number) {
        return `This action updates a #${id} card`;
    }

    remove(id: number, userId: number) {
        return `This action removes a #${id} card`;
    }
}
