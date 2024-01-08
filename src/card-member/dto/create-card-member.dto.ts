import { IsNotEmpty } from 'class-validator';

export class CreateCardMemberDto {
  @IsNotEmpty()
  cardId: number;

  @IsNotEmpty()
  userId: number;
}
