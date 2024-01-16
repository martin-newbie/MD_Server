import { Property, Required } from "@tsed/schema";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserDataModel{
    @PrimaryGeneratedColumn()
    @Property()
    id: number;

    @Column()
    @Required()
    uuid: string;

    @Column()
    @Required()
    userNickname: string;

    @Column({default: 0})
    @Required()
    userLevel: number;

    @Column({default: 0})
    @Required()
    userExp: number;

    @Column({default: 0})
    @Required()
    userDia: number;

    @Column({default: 0})
    @Required()
    userCoin: number;
}