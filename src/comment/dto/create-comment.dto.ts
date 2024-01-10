import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  cardId: number;

  @IsNotEmpty()
  comment: string;
}
