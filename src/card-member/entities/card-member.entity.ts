import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cardMembers')
export class CardMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  card_id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;
}
