import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { DataSource } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";

@Injectable()
export class InGameService{

    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    @Inject()
    protected userRepos: UserRepository;
    

}