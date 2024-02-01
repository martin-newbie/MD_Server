import { Required } from "@tsed/schema";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'deck'})
export class Deck {

    @PrimaryGeneratedColumn()
    @Required()
    id: number;

    @Column({default: ""})
    @Required()
    user_uuid: string;

    @Required()
    unit_indexes: number[];

    @Column({ default: -1 })
    @Required()
    unit1: number;

    @Column({ default: -1 })
    @Required()
    unit2: number;

    @Column({ default: -1 })
    @Required()
    unit3: number;

    @Column({ default: -1 })
    @Required()
    unit4: number;

    @Column({ default: -1 })
    @Required()
    unit5: number;
    
    @Column()
    @Required()
    deck_index: number;
}