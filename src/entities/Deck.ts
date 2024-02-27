import { Required } from "@tsed/schema";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: 'deck' })
export class Deck {

    constructor(_deck_index: number) {
        this.deck_index = _deck_index;
        this.title = "deck-" + _deck_index?.toString();
    }

    @PrimaryGeneratedColumn()
    @Required()
    id: number;

    @Column({ default: 0 })
    @Required()
    deck_index: number;

    @Column({ default: "deck" })
    @Required()
    title: string;

    @Column({ default: -1 })
    unit1: number;

    @Column({ default: -1 })
    unit2: number;

    @Column({ default: -1 })
    unit3: number;

    @Column({ default: -1 })
    unit4: number;

    @Column({ default: -1 })
    unit5: number;

    @Required()
    unit_indexes: number[];

    @Column()
    user_uuid: string;

    @ManyToOne(() => User, user => user.decks, {})
    @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
    user: User;

    initUnitId(){
        this.unit_indexes = [this.unit1, this.unit2, this.unit3, this.unit4, this.unit5];
        return this;
    }
}