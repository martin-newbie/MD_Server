import { CollectionOf, Property, Required } from "@tsed/schema";
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Unit } from "./Unit";
import { Deck } from "./Deck";
import { Exception } from "@tsed/exceptions";
import { StagePerfaction } from "./StagePerfaction";

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


    getEnergy(): number {
        const now = new Date();

        if (this.energy < this.maxEnergy()) {
            const chargedEnergy = ((now.getTime() - this.last_energy_updated.getTime()) * 1000) % (60 * 6);
            this.energy += chargedEnergy;

            if (this.energy > this.maxEnergy()) {
                this.energy = this.maxEnergy();
            }
        }

        this.last_energy_updated = now;
        return this.energy;
    }

    updateEnergy(extra: number) {
        this.getEnergy();

        if (extra + this.energy < 0) {
            // error
            throw Exception;
        }

        this.energy += extra;
        this.last_energy_updated = new Date();
    }

    maxEnergy() {
        return 100 + this.level * 2;
    }
}