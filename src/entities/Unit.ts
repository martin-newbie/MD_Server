import { CollectionOf, Required } from '@tsed/schema';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import fs from 'fs';
import { Equipment } from './Equipment';


@Entity({name: 'unit'})
export class Unit {

    constructor(_idx: number, _defaultLevel: number = 0) {
        this.index = _idx;
        this.level = _defaultLevel;
        this.skill_level = [this.skill_level_0, this.skill_level_1, this.skill_level_2, this.skill_level_3];
    }

    @PrimaryGeneratedColumn()
    @Required()
    id: number;

    @Column({default: 0})
    @Required()
    index: number;

    @Column({default: 0})
    @Required()
    rank: number;

    @Column({default: 0})
    @Required()
    level: number;

    @Column({default: 0})
    @Required()
    exp: number;

    @Column()
    user_uuid: string;

    @Column({default: 0})
    skill_level_0: number;
    
    @Column({default: 0})
    skill_level_1: number;
    
    @Column({default: 0})
    skill_level_2: number;
    
    @Column({default: 0})
    skill_level_3: number;

    @Required()
    skill_level: number[];

    @ManyToOne(() => User, (user) => user.units, {})
    @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
    user: User;

    @CollectionOf(Equipment)
    @OneToMany(()=>Equipment, (equipment) => equipment.unit, {cascade: ['insert']})
    @JoinColumn({name: 'id', referencedColumnName: 'unit_id'})
    equipments: Equipment[];

    addEquipment(equipment: Equipment){
        if (!this.equipments) {
            this.equipments = [];
        }

        this.equipments.push(equipment);
        equipment.unit = this;
    }

    updateExp(extra: number) {
        this.exp += extra;
        while (this.getRequireExp(this.level) <= this.exp) {
            this.exp -= this.getRequireExp(this.level);
            this.level++;
        }
    }

    getRequireExp(level: number) {
        const dataPath = 'src/data/UnitExp.txt';
        const data = fs.readFileSync(dataPath, 'utf8');
        const levelExp = Number.parseInt(data.split('\n')[level]);
        return levelExp;
    }

    initSkillLevel(){
        this.skill_level = [this.skill_level_0, this.skill_level_1, this.skill_level_2, this.skill_level_3];
        if(!this.equipments) this.equipments = [];
        return this;
    }
}