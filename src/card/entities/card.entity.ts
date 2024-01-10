import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Level } from '../types/cardLevel.type';
import { CardMember } from 'src/card-member/entities/card-member.entity';
import { BoardColumn } from 'src/board-column/entities/board-column.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity('cards')
export class Card {
  // task 카드 id
  @PrimaryGeneratedColumn()
  id: number;

  // 해당 카드를 삽입할 컬럼의 id
  @ManyToOne(() => BoardColumn, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }) // User 엔터티와의 관계 설정
  // @JoinColumn({ name: 'board_column_id' }) // 외부키로 사용할 열의 이름
  board_column: BoardColumn;
  @Column({ type: 'int', nullable: false })
  board_column_id: number;

  // task 담당자 id
  @OneToMany(() => CardMember, (card_member) => card_member.card_id, { onDelete: 'CASCADE' })
  card_member: CardMember[];

  // task 카드 생성, 수정 시 카드의 정렬 순서를 저장할 컬럼
  @Column({ type: 'varchar', nullable: false })
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

  // 해당 카드에 달린 댓글
  @OneToMany(() => Comment, (comment) => comment.card_id, { onDelete: 'CASCADE' })
  comment: Comment[];
}
