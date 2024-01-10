import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from './entities/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardColumn } from 'src/board-column/entities/board-column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, BoardColumn])],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
