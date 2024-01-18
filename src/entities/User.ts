import { Property, Required } from "@tsed/schema";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Unit } from "./Unit";

@Entity({name: 'user'})
@Unique('user_uuid', ['uuid'])
export class User{
    @PrimaryGeneratedColumn()
    id: number

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

    @OneToMany(type => Unit, (units) => units.user, { eager: true, cascade: ['insert'] })
    units: Unit[];

    addUnit(unit: Unit) {
        if (this.units == null) {
            this.units = [];
        }

        this.units.push(unit);
        unit.user = this;
    }

}