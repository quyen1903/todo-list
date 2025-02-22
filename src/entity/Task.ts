import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("task")
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'date', nullable: true})
    startDate: string | null; // Default to current date

    @Column({ type: 'date', nullable: true})
    endDate: string | null; // Default to current date
}
