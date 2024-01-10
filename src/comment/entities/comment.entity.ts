import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { Card } from 'src/card/entities/card.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Card, { eager: true })
  @JoinColumn({ name: 'card_id' })
  card: Card;
  @Column({ type: 'int', nullable: false })
  card_id: number;

  @ManyToOne(() => BoardMember, { eager: true })
  @JoinColumn({ name: 'board_member' })
  board_member: BoardMember;
  @Column({ type: 'int', nullable: false })
  board_member_id: number;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Timestamp;
}
