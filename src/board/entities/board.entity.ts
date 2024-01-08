import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';
import { BoardColumn } from 'src/board-column/entities/board-column.entity';

// board에서 회원번호 지우고 board_member에 보드 생성자 여부를 표시할까? ? - 이아영
// board 멤버 추가할 때 가드 만들기~
@Entity({
  name: 'boards', // 테이블 명
})
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  // 다대일 관계 설정(user)
  @ManyToOne(() => User, (user) => user.board)
  @JoinColumn({ name: 'user_id' })
  user: User; // 관계 테이블
  @Column({ type: 'int', name: 'user_id' })
  user_id: number; // 외래키

  // 일대다 관계 설정(board_member)
  @OneToMany(() => BoardMember, (boardMember) => boardMember.board)
  boardMember: BoardMember[];

  // 일대다 관계 설정(board_member)
  @OneToMany(() => BoardColumn, (boardColumn) => boardColumn.board)
  boardColumn: BoardColumn[];
}
