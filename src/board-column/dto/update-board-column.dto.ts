import { PartialType } from '@nestjs/swagger';
import { CreateBoardColumnDto } from './create-board-column.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateBoardColumnDto extends PartialType(CreateBoardColumnDto) {
  @IsNotEmpty({ message: '칼럼 제목을 입력해주세요.' })
  title: string;

  index: number;
}
