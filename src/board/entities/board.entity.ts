import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
// import { User } from 'src/user/entities/user.entity';
// import { BoardColumn } from 'src/board-column/entities/board-column.entity';

@Entity({
  name: 'boards',
})
export class Board {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  // @Column({ type: 'int', unsigned: true })
  // user_id: number;

  // user 엔티티에도 OneToMany 관계설정 해야됌
  // 사용자가 삭제되면 보드도 같이 삭제
  // @ManyToOne((type) => User, (user) => user.boards, { onDelete: 'CASCADE' })
  // user: User;

  // @OneToMany((type) => BoardColumn, (boardColumn) => boardColumn.board)
  // boardColumns: BoardColumn[];
}
