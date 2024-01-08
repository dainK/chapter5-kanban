import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  card_id: number;

  @IsNotEmpty()
  comment: string;
}
