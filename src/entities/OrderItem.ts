import {MaxLength, Maximum, Minimum, Property, Required} from "@tsed/schema";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from './Order';


@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  @Property()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @Column()
  @Required()
  title: string;

  @Column()
  @Minimum(0)
  @Maximum(100)
  count: number;
}
