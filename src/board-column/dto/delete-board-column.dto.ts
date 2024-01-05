import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardColumnDto } from './create-board-column.dto';

export class DeleteBoardColumnDto extends PartialType(CreateBoardColumnDto) {}
