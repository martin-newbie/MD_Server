import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { Item } from "../entities/Item";
import { DataSource, Repository } from "typeorm";


@Injectable()
export class ItemRepository {
    
    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    repository: Repository<Item>;

    $onInit() {
        this.repository = this.datasource.getRepository(Item);
    }

    updateItem(item: Item) {
        this.repository.save(item);
    }

}