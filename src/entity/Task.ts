import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 80 })
    name: string;

    @Column({ nullable: true })
    startDate: string;

    @Column({ nullable: true })
    endDate: string;
}