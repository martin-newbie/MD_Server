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
    userLevel: number;

    @Column({default: 0})
    userExp: number;

    @Column({default: 0})
    userDia: number;

    @Column({default: 0})
    userCoin: number;
}