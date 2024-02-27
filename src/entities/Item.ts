import { Required } from "@tsed/schema";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity({ name: 'item' })
export class Item{

    constructor(_idx: number) {
        this.idx = _idx;
    }

    // for server
    @PrimaryGeneratedColumn()
    @Required()
    id: number;

    // unique id
    @Column({default: 0})
    @Required()
    idx: number;

    @Column({default: 0})
    @Required()
    count: number;

    @Column()
    user_uuid: string;

    @ManyToOne(() => User, user => user.items, {})
    @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
    user: User;
}