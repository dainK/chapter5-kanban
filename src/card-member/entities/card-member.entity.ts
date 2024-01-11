import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { Card } from 'src/card/entities/card.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// 카드id와 해당 카드를 담당하는 유저의 id를 저장
@Entity('card_member')
export class CardMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Card, { eager: true })
  @JoinColumn({ name: 'card_id' })
  card: Card;
  @Column({ type: 'int', nullable: false })
  card_id: number;

  @ManyToOne(() => BoardMember, { eager: true })
  @JoinColumn({ name: 'board_member_id' })
  boardMember: BoardMember;
  @Column({ type: 'int', nullable: false })
  board_member_id: number;
}
