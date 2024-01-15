import {Inject, Injectable} from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { DataSource } from "typeorm";
import { HelloModel } from "../models/HelloModel";
import { HelloRepository } from "../repositories/HelloRepository";

@Injectable()
export class HelloService {
  @Inject()
  protected helloRepository: HelloRepository;

  getHellos(name: string) {
    const hello = new HelloModel();
    return "hello " + name;
  }

  getHello(id: number) {
    const hello = this.helloRepository.findOne(id);
    return hello;
  }

  create(hello: HelloModel) {
    return this.helloRepository.save(hello);
  }

  update(hello: HelloModel) {
    // return this.helloRepository.
  }

  getHelloByName(name: string){
    return this.helloRepository.findByFirstName(name);
  }
}
