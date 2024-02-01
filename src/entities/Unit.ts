import { Required } from '@tsed/schema';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';


@Entity({name: 'unit'})
export class Unit {

    constructor(_idx: number, _defaultLevel: number = 0) {
        this.index = _idx;
        this.level = _defaultLevel;
        this.skill_level = [this.skill_level_0, this.skill_level_1, this.skill_level_2, this.skill_level_3];
    }

    @PrimaryGeneratedColumn()
    @Required()
    id: number;

    @Column({default: 0})
    @Required()
    index: number;

    @Column({default: 0})
    @Required()
    level: number;

    @Column({default: 0})
    @Required()
    exp: number;

    @Column()
    user_uuid: string;

    @Column({default: 0})
    skill_level_0: number;
    
    @Column({default: 0})
    skill_level_1: number;
    
    @Column({default: 0})
    skill_level_2: number;
    
    @Column({default: 0})
    skill_level_3: number;

    @Required()
    skill_level: number[];

    @ManyToOne(() => User, (user) => user.units, {})
    @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
    user: User;
}