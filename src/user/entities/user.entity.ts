import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../types/userRole.type';
import { Board } from 'src/board/entities/board.entity';
import { BoardMember } from 'src/board-member/entities/board-member.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.Member })
  role: Role;

  @Column({ type: 'varchar', unique:true, select: true, nullable: false })
  name: string;

  // 일대다 관계 설정(board)
  //(supportMessage) => supportMessage.user : supportMessage 엔티티 내의 'user' 필드를 참고
  @OneToMany(() => Board, (board) => board.user)
  board: Board[];

  // 일대다 관계 설정(board_member)
  //(supportMessage) => supportMessage.user : supportMessage 엔티티 내의 'user' 필드를 참고
  @OneToMany(() => BoardMember, (boardMember) => boardMember.user)
  boardMember: Board[];
}
