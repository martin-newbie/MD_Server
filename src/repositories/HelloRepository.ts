import {Inject, Injectable} from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { DataSource, Repository } from "typeorm";
import { HelloModel } from "../models/HelloModel";

@Injectable()
export class HelloRepository {
    @Inject(MYSQL_DATASOURCE)
    protected dataSource: DataSource;

    private repository: Repository<HelloModel>;


    $onInit() {
        if (this.dataSource.isInitialized) {
            this.repository = this.dataSource.getRepository(HelloModel)
        }

        console.log("================");
    }

    findOne(id: number) {
        return this.repository.findOneById(id);
    }

    findByFirstName(name: string) {
        return this.repository.find(
            {where: {firstName: name}}
        );
    }

    save(hello: HelloModel) {
        return this.repository.save(hello);
    }
}
