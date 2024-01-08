import { IsNotEmpty, IsString } from 'class-validator';
import { Level } from '../types/cardLevel.type';

export class CreateCardDto {
  @IsNotEmpty()
  boardColumnId: number;

  @IsNotEmpty()
  userId: number[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  deadLine: Date;

  @IsNotEmpty()
  priority: Level;
}
