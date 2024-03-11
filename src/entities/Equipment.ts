import { Required } from "@tsed/schema";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Unit } from "./Unit";

@Entity('equipment')
export class Equipment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 0})
    @Required()
    index: number;
    
    @Column({default: 0})
    @Required()
    place_index: number;

    @Column({default: 0})
    @Required()
    level: number;

    @Column({default: 0})
    @Required()
    exp: number;

    @Column({default: 0})
    unit_id: number;

    @ManyToOne(type => Unit, (unit) => unit.equipments)
    @JoinColumn({name: 'unit_id', referencedColumnName: 'id'})
    unit: Unit;
}