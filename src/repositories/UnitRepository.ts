import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { Unit } from "../entities/Unit";
import { DataSource, Repository } from "typeorm";
import { Exception } from "@tsed/exceptions";



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

    async findWithId(id: number){
        const unit = await this.repository.findOne({where: {id: id}, relations: ['equipments']});
        if (!unit) throw new Exception(400, "no unit available!");
        return unit;
    }
}