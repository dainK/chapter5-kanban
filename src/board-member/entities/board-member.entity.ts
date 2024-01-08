import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Board } from 'src/board/entities/board.entity';

import { BoardMemberRole } from '../types/boradMemberRole.type';

// board에서 회원번호 지우고 board_member에 보드 생성자 여부를 표시할까? ? - 이아영
// board 멤버 추가할 때 가드 만들기~
// 관계를 줄이고,, 컬럼을 추가하기..??
@Entity({
  name: 'board_member', // 테이블 명
})
export class BoardMember {
  @PrimaryGeneratedColumn()
  id: number;

  // 다대일 관계 설정(user)
  @ManyToOne(() => User, (user) => user.boardMember)
  @JoinColumn({ name: 'user_id' })
  user: User; // 관계 테이블
  @Column({ type: 'int', name: 'user_id' })
  user_id: number; // 외래키

  // 다대일 관계 설정(board)
  @ManyToOne(() => Board, (board) => board.boardMember, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id' })
  board: Board; // 관계 테이블
  @Column({ type: 'int', name: 'board_id' })
  board_id: number; // 외래키

  @Column({ type: 'enum', enum: BoardMemberRole, default: BoardMemberRole.Viewer }) // role 필드는 enum에서 설정한 값만 가질 수 있음
  role: BoardMemberRole;
}
