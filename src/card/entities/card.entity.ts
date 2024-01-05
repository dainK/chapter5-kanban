import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Level } from '../types/cardLevel.type';

@Entity('cards')
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: false })
    column_id: number;

    @Column({ type: 'int', nullable: false })
    board_member_id: number;

    @Column({ type: 'varchar', nullable: false, unique: true })
    order: string;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    content: string;

    @Column({ type: 'date', nullable: false })
    dead_line: Date;

    @Column({ type: 'enum', nullable: false })
    priority: Level;
}
