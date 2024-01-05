import { Module } from '@nestjs/common';
import { BoardColumnService } from './board-column.service';
import { BoardColumnController } from './board-column.controller';
import { BoardColumn } from './entities/board-column.entity';
// import { Board } from 'src/board/entities/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BoardColumn])],
  controllers: [BoardColumnController],
  providers: [BoardColumnService],
})
export class BoardColumnModule {}
