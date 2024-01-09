import { IsNotEmpty } from 'class-validator';

export class CreateBoardColumnDto {
  @IsNotEmpty({ message: '칼럼 제목을 입력해주세요.' })
  title: string;
}
