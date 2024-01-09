import { Card } from 'src/card/entities/card.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cardMembers')
export class CardMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  card_id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => Card, (card) => card.cardMembers)
  card: Card;
}
