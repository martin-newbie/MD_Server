import { Required } from '@tsed/schema';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';


@Entity({name: 'unit'})
export class Unit {

    constructor(_idx: number, _defaultLevel: number = 0) {
        this.index = _idx;
        this.level = _defaultLevel;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 0})
    @Required()
    index: number;

    @Column({default: 0})
    @Required()
    level: number;

    @ManyToOne(type => User, (user) => user.units)
    @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
    user: User;
}