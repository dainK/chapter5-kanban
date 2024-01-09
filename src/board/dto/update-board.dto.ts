import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateBoardDto {
  @IsNotEmpty({ message: '보드 제목을 입력해주세요.' })
  title: string;
}
