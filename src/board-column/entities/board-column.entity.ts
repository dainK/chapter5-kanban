import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
// import { Board } from 'src/board/entities/board.entity';

@Entity({
  name: 'boardColumns',
})
export class BoardColumn {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'int', unsigned: true })
  board_id: number;

  // 보드가 삭제되면 보드컬럼도 같이 삭제
  // @ManyToOne((type) => Board, (board) => board.boardColumns, { onDelete: 'CASCADE' })
  // board: Board;
}
