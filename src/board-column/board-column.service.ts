import { Injectable } from '@nestjs/common';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';

@Injectable()
export class BoardColumnService {
  create(createBoardColumnDto: CreateBoardColumnDto) {
    return 'This action adds a new boardColumn';
  }

  findAll() {
    return `This action returns all boardColumn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} boardColumn`;
  }

  update(id: number, updateBoardColumnDto: UpdateBoardColumnDto) {
    return `This action updates a #${id} boardColumn`;
  }

  remove(id: number) {
    return `This action removes a #${id} boardColumn`;
  }
}
