import { CollectionOf, Property, Required } from "@tsed/schema";
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Unit } from "./Unit";
import { Deck } from "./Deck";
import { StagePerfaction } from "./StagePerfaction";
import { Item } from "./Item";
import { Exception } from "@tsed/exceptions";

@Entity({ name: 'user' })
@Unique('user_uuid', ['uuid'])
export class User {
    @PrimaryGeneratedColumn()
    @Required()
    id: number

    @PrimaryColumn()
    @Column()
    @Required()
    uuid: string;

    @Column({ default: "" })
    @Required()
    nickname: string;

    @Column({ default: 0 })
    @Required()
    level: number;

    @Column({ default: 0 })
    @Required()
    exp: number;

    @Column({ default: 0 })
    @Required()
    dia: number;

    @Column({ default: 0 })
    @Required()
    coin: number;

    @Column({default: 0})
    @Required()
    energy: number;

    @Column({default: null})
    @Required()
    last_energy_updated: Date;

    @CollectionOf(Unit)
    @OneToMany(type => Unit, (units) => units.user, { cascade: ['insert'] })
    @JoinColumn({ name: 'uuid', referencedColumnName: 'user_uuid' })
    units: Unit[];

    @CollectionOf(Deck)
    @OneToMany(type => Deck, (deck) => deck.user, { cascade: ['insert'] })
    @JoinColumn({ name: 'uuid', referencedColumnName: "user_uuid" })
    decks: Deck[];

    @CollectionOf(StagePerfaction)
    @OneToMany(type=> StagePerfaction, (stagePerfaction) => stagePerfaction.user, {cascade: ['insert']})
    @JoinColumn({name: 'uuid', referencedColumnName: 'user_uuid'})
    stage_perfactions: StagePerfaction[];

    @CollectionOf(Item)
    @OneToMany(type => Item, (item) => item.user, { cascade: ['insert'] })
    @JoinColumn({ name: 'uuid', referencedColumnName: 'user_uuid' })
    items: Item[];

    addUnit(unit: Unit) {
        if (this.units == null) {
            this.units = [];
        }

        this.units.push(unit);
        unit.user = this;
    }

    addDeck(deck: Deck){
        if(this.decks == null){
            this.decks = [];
        }

        this.decks.push(deck);
        deck.user = this;
    }

    addStagePerfaction(stagePerfaction: StagePerfaction){
        if(this.stage_perfactions === null){
            this.stage_perfactions = [];
        }

        this.stage_perfactions.push(stagePerfaction);
        stagePerfaction.user = this;
    }

    addItem(item: Item){
        if(this.items == null){
            this.items = [];
        }

        const findItem = this.items.find(item => item.idx === item.idx);
        if (findItem !== null && findItem !== undefined) {
            findItem.count += item.count;
        } else {
            this.items.push(item);
            item.user = this;
        }

        return findItem;
    }

    useItem(item: Item){
        
        if(this.items == null){
            this.items = [];
            throw new Exception(400, "item is empty");
        }

        const findItem = this.items.find(i => i.idx === item.idx);

        if(findItem === null || findItem === undefined){
            throw new Exception(400, "item not found");
        }
        if(findItem.count < item.count){
            throw new Exception(400, "item count is below use count");
        }

        findItem.count -= item.count;
        return findItem;
    }

    maxEnergy() {
        return 100 + this.level * 2;
    }
}