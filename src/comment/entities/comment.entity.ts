import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  card_id: number;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @Column({ type: 'text', nullable: false })
  comment: string;
}
