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

    @Column({default: null})
    @Required()
    str_last_energy_updated: string;
    
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
        const dataPath = 'src/data/UserExp.txt';
        const data = fs.readFileSync(dataPath, 'utf-8');
        const exp = JSON.parse(data).exp[level];
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
            return findItem;
        } else {
            this.items.push(item);
            item.user = this;
        }
    }

    useItem(item: Item) {

        if (this.items == null) {
            this.items = [];
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

        if (!this.str_last_energy_updated) { this.str_last_energy_updated = new Date().toJSON(); }
        const lastEnergyTime = new Date(Date.parse(this.str_last_energy_updated));
        
        if (this.energy < this.maxEnergy()) {

            const now = new Date();
            const diff = now.getTime() - lastEnergyTime.getTime();
            const addedEnergy = Math.floor((diff / 1000) / 360);
            console.log(addedEnergy);

            this.energy += addedEnergy;
            if (this.energy > this.maxEnergy()) {
                this.energy = this.maxEnergy();
            }

            const newEnergyTime = new Date(lastEnergyTime.getTime() + addedEnergy * 1000 * 360);
            this.updateEnergyTime(newEnergyTime);
        }

        return this.energy;
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

    updateEnergyTime(date: Date) {
        this.str_last_energy_updated = date.toJSON();
    }

    maxEnergy() {
        return 100 + this.level * 2;
    }
}