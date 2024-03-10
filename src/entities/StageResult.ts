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
    condition_1: boolean;

    @Column()
    condition_2: boolean;

    @Column()
    condition_3: boolean;

    @Required()
    condition: boolean[];

    @ManyToOne(()=>User, (user) => user.stage_result)
    user: User;

    isAllConditionTrue(){
        return this.condition_1 && this.condition_2 && this.condition_3;
    }

    initCondition(){
        this.condition = [this.condition_1, this.condition_2, this.condition_3];
    }
}
