import { CollectionOf, Property, Required } from "@tsed/schema";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Unit } from "./Unit";
import { OnSerialize } from "@tsed/json-mapper";

@Entity({name: 'user'})
@Unique('user_uuid', ['uuid'])
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @PrimaryColumn()
    @Column()
    uuid: string;

    @Column()
    @Required()
    nickname: string;

    @Column({default: 0})
    @Required()
    level: number;

    @Column({default: 0})
    @Required()
    exp: number;

    @Column({default: 0})
    @Required()
    dia: number;

    @Column({default: 0})
    @Required()
    coin: number;

    // @Property()
    @CollectionOf(Unit)
    @OneToMany(type => Unit, (units) => units.user, { cascade: ['insert'] })
    @JoinColumn({ name: 'uuid', referencedColumnName: 'user_uuid' })
    units: Unit[];

    addUnit(unit: Unit) {
        if (this.units == null) {
            this.units = [];
        }

        this.units.push(unit);
        unit.user = this;
    }

}