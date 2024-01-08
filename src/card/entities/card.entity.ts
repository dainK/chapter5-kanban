import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Level } from '../types/cardLevel.type';

@Entity('cards')
export class Card {
  // task 카드 id
  @PrimaryGeneratedColumn()
  id: number;

  // 해당 카드를 삽입할 컬럼의 id - 수정을 통해 다른 컬럼으로 이동할 수 있다.
  @Column({ type: 'int', nullable: false })
  board_column_id: number;

  // 작성자 id - 카드 수정 시 담당자 id로 변경할 수 있으며, 해당 유저만 수정, 삭제가 가능하다.
  // (협업 보드를 사용중인 멤버만 따로 담아놓은 entity에서 가져온다.)
  @Column({ type: 'int', nullable: false })
  board_member_id: number;

  // task 카드 생성, 수정 시 카드의 순서를 저장할 컬럼
  // JIRA의 LexoRank를 이용해볼 예정이다.
  @Column({ type: 'varchar', nullable: false, unique: true })
  order: string;

  // task 카드 제목 - 수정 가능
  @Column({ type: 'varchar', nullable: false })
  title: string;

  // task 카드 내용 - 수정 가능
  @Column({ type: 'text', nullable: false })
  content: string;

  // task 마감일
  @Column({ type: 'date', nullable: false })
  dead_line: Date;

  // task의 중요도에 따라 우선순위에 차등을 둔다. (HIGH, MEDIUM, LOW 등이 있다.)
  @Column({ type: 'enum', enum: Level, nullable: false })
  priority: Level;
}
