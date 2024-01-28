import { Column, Entity } from "typeorm";
import { Deck } from "./Deck";
import { Required } from "@tsed/schema";


@Entity({ name: 'test-deck' })
export class TestDeck extends Deck {

    @Column()
    @Required()
    deck_index: number;

}