import {MaxLength, Maximum, Minimum, Property, Required} from "@tsed/schema";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class HelloModel {
  @PrimaryGeneratedColumn()
  @Property()
  id: number;

  @Column({length: 100})
  @MaxLength(100)
  @Required()
  firstName: string;

  @Column()
  @Required(false)
  middleName: string;

  @Column()
  @Minimum(0)
  @Maximum(100)
  age: number;

  @Column({default: true})
  isLive: boolean;
}
