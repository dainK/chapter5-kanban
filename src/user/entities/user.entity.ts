import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../types/userRole.type';
import { Board } from 'src/board/entities/board.entity';

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

  @Column({ type: 'varchar', select: true, nullable: false })
  name: string;

  // 일대다 관계 설정(board_member)
  //(supportMessage) => supportMessage.user : supportMessage 엔티티 내의 'user' 필드를 참고
  @OneToMany(() => Board, (board) => board.user)
  board: Board[];
}
