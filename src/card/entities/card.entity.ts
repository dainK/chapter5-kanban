import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Level } from '../types/cardLevel.type';

@Entity('cards')
export class Card {
  // task 카드 id
  @PrimaryGeneratedColumn()
  id: number;

  // 해당 카드를 삽입할 컬럼의 id
  @Column({ type: 'int', nullable: false })
  board_column_id: number;

  // task 담당자 id 배열
  @Column({ type: 'int', nullable: false })
  user_id: number[];

  // task 카드 생성, 수정 시 카드의 순서를 저장할 컬럼
  // JIRA의 LexoRank를 이용해볼 예정이다.
  @Column({ type: 'varchar', nullable: false, unique: true })
  order: string;

  // task 카드 제목
  @Column({ type: 'varchar', nullable: false })
  title: string;

  // task 카드 내용
  @Column({ type: 'text', nullable: false })
  content: string;

  // task 마감일
  @Column({ type: 'date', nullable: false })
  dead_line: Date;

  // task의 중요도에 따라 우선순위에 차등을 둔다. (HIGH, MEDIUM, LOW)
  @Column({ type: 'enum', enum: Level, nullable: false })
  priority: Level;
}
