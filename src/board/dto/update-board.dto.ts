import { PartialType } from '@nestjs/swagger';
import { CreateBoardDto } from './create-board.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  @IsNotEmpty({ message: '보드 제목을 입력해주세요.' })
  title: string;
}
