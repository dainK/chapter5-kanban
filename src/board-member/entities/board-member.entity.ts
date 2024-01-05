import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'boardMembers',
})
export class BoardMember {
  @PrimaryGeneratedColumn()
  id: number;

  // USER 테이블과 관계설정 필요 user_id

  // BOARD 테이블과 관계설정 필요 board_id
}
