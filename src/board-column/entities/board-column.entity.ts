import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Board } from 'src/board/entities/board.entity';

@Entity({
  name: 'board_column', // 테이블 명 
})
export class BoardColumn {
  @PrimaryGeneratedColumn()
  id: number;

  // 다대일 관계 설정(board)
  @ManyToOne(() => Board, (board) => board.boardColumn, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id' })
  board: Board; // 관계 테이블
  @Column({ type: 'int', name: 'board_id' })
  board_id: number; // 외래키

  @Column({ type: 'varchar', nullable: false })
  title: string;

  // 일대다 관계 설정(card)
  // @OneToMany(() => Card, (card) => card.boardColum)
  // card: Card[];
}
