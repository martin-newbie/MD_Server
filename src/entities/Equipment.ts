import { Required } from "@tsed/schema";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Unit } from "./Unit";
import fs from 'fs';

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

    updateExp(extra: number) {
        this.exp += extra;
        while (this.exp >= this.getRequireExp(this.level)) {
            this.exp -= this.getRequireExp(this.level);
            this.level++;
        }
    }

    getRequireExp(level: number) {
        const dataPath = 'src/data/equipmentExpTable.txt';
        const data = fs.readFileSync(dataPath, 'utf8');
        const levelExp = Number.parseInt(data.split('\n')[level]);
        return levelExp;
    }
}