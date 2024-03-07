import { CollectionOf, Property, Required } from "@tsed/schema";
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Unit } from "./Unit";
import { Deck } from "./Deck";
import { StageResult as StageResult } from "./StageResult";
import { Item } from "./Item";
import { Exception } from "@tsed/exceptions";
import fs from 'fs';

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

    @Column({ default: 0 })
    @Required()
    energy: number;

    @Required()
    str_last_energy_updated: string;
    
    @Column({ default: null })
    last_energy_updated: Date;

    @CollectionOf(Unit)
    @OneToMany(type => Unit, (units) => units.user, { cascade: ['insert'] })
    @JoinColumn({ name: 'uuid', referencedColumnName: 'user_uuid' })
    units: Unit[];

    @CollectionOf(Deck)
    @OneToMany(type => Deck, (deck) => deck.user, { cascade: ['insert'] })
    @JoinColumn({ name: 'uuid', referencedColumnName: "user_uuid" })
    decks: Deck[];

    @CollectionOf(StageResult)
    @OneToMany(type => StageResult, (stagePerfaction) => stagePerfaction.user, { cascade: ['insert'] })
    @JoinColumn({ name: 'uuid', referencedColumnName: 'user_uuid' })
    stage_result: StageResult[];

    @CollectionOf(Item)
    @OneToMany(type => Item, (item) => item.user, { cascade: ['insert'] })
    @JoinColumn({ name: 'uuid', referencedColumnName: 'user_uuid' })
    items: Item[];

    updateExp(extra: number) {
        this.exp += extra;
        while (this.getRequireExp(this.level) <= this.exp) {
            this.exp -= this.getRequireExp(this.level);
            this.level++;
        }
    }

    getRequireExp(level: number) {
        const dataPath = 'src/data/userExpTable.txt';
        const data = fs.readFileSync(dataPath, 'utf-8');
        const exp = Number.parseInt(data.split('\n')[level]);
        return exp;
    }

    addUnit(unit: Unit) {
        if (this.units == null) {
            this.units = [];
        }

        this.units.push(unit);
        unit.user = this;
    }

    addDeck(deck: Deck) {
        if (this.decks == null) {
            this.decks = [];
        }

        this.decks.push(deck);
        deck.user = this;
    }

    addStageResult(stagePerfaction: StageResult) {
        if (this.stage_result === null) {
            this.stage_result = [];
        }

        this.stage_result.push(stagePerfaction);
        stagePerfaction.user = this;
    }

    addItem(item: Item) {
        if (this.items == null) {
            this.items = [];
        }

        const findItem = this.items.find(i => i.idx === item.idx);

        if (findItem) {
            findItem.count += item.count;
        } else {
            this.items.push(item);
            item.user = this;
        }
    }

    useItem(item: Item) {

        if (this.items == null) {
            this.items = [];
            throw new Exception(400, "item is empty");
        }

        const findItem = this.items.find(i => i.idx === item.idx);

        if (!findItem) {
            throw new Exception(400, "item not found");
        }
        if (findItem.count < item.count) {
            throw new Exception(400, "item count is below use count");
        }

        findItem.count -= item.count;
        return findItem;
    }
    
    getEnergy() {

        if (this.energy < this.maxEnergy()) {

            const now = new Date();
            const diff = now.getTime() - this.last_energy_updated.getTime();
            const addedEnergy = Math.floor((diff / 1000) / 60);

            this.energy += addedEnergy;
            if (this.energy > this.maxEnergy()) {
                this.energy = this.maxEnergy();
            }

            this.last_energy_updated.setMilliseconds(addedEnergy * 1000 + this.last_energy_updated.getMilliseconds());
            this.updateEnergyTime(this.last_energy_updated);
        }

        return this.energy;
    }

    updateCurrency(idx: number, count: number) {
        switch (idx) {
            case 0:
                this.dia += count;
                break;
            case 1:
                this.coin += count;
                break;
            case 2:
                this.updateEnergy(count);
                break;
        }
    }

    updateEnergy(updated: number) {

        this.getEnergy();

        if (this.energy + updated < 0) {
            throw new Exception(400, "not enough energy");
        }

        if (this.energy >= this.maxEnergy() && this.energy + updated < this.maxEnergy()) {
            this.updateEnergyTime(new Date());
        }

        this.energy += updated;
    }

    updateEnergyTime(date: Date) {
        if(!date || date.getTime() === 0) date = new Date();

        this.last_energy_updated = date;
        this.str_last_energy_updated = date.toJSON();
    }

    maxEnergy() {
        return 100 + this.level * 2;
    }
}