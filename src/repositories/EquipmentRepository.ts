import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { DataSource, Repository } from "typeorm";
import { Equipment } from "../entities/Equipment";

@Injectable()
export class EquipmentRepository{
    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    repository: Repository<Equipment>;

    $onInit() {
        this.repository = this.datasource.getRepository(Equipment);
    }

    updateEquipment(equipment: Equipment) {
        this.repository.save(equipment);
    }
}