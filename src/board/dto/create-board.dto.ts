import { IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty({ message: '보드 제목을 입력해주세요.' })
  title: string;
}
