import { Inject, Injectable } from '@tsed/di';
import { StageResult } from '../entities/StageResult';
import { DataSource, Repository } from 'typeorm';
import { MYSQL_DATASOURCE } from '../datasources/MysqlDatasource';

@Injectable()
export class StageRepository {

    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    private repository: Repository<StageResult>;

    $onInit() {
        this.repository = this.datasource.getRepository(StageResult);
    }

    saveStage(stageResult: StageResult) {
        return this.repository.save(stageResult);
    }

}