import { Required } from "@tsed/schema";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class StageResult {

    @PrimaryGeneratedColumn()
    @Required()
    perfaction_id: number;

    @Column({default: 0})
    @Required()
    chapter_idx: number;

    @Column({default: 0})
    @Required()
    stage_idx: number;

    @Column()
    @Required()
    condition_1: boolean;

    @Column()
    @Required()
    condition_2: boolean;

    @Column()
    @Required()
    condition_3: boolean;

    @ManyToOne(()=>User, (user) => user.stage_result)
    user: User;
}
