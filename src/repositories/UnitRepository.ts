import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { Unit } from "../entities/Unit";
import { DataSource, Repository } from "typeorm";



@Injectable()
export class UnitRepository {

    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    repository: Repository<Unit>;

    $onInit() {
        this.repository = this.datasource.getRepository(Unit);
    }

    saveUnit(unit: Unit){
        this.repository.save(unit);
    }

    updateExp(unit: Unit, exp: number){
        unit.updateExp(exp);
        this.saveUnit(unit);
    }
}