import {MaxLength, Maximum, Minimum, Property, Required} from "@tsed/schema";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./OrderItem";


@Entity({name: 'orders'})
export class Order {
  @PrimaryColumn()
  @Property()
  orderNo: string;

  @Column({length: 100})
  @MaxLength(100)
  @Required()
  title: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
