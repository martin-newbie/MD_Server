import {registerProvider} from "@tsed/di";
import {DataSource} from "typeorm";
import {Logger} from "@tsed/logger";
import { envs } from "../config/envs";
import { HelloModel } from "../models/HelloModel";
import { UserDataModel } from "../models/UserDataModel";

export const MYSQL_DATASOURCE = Symbol.for("MysqlDatasource");
export const MysqlDatasource = new DataSource({
  type: "mysql",
  entities: [HelloModel, UserDataModel],
  host: "localhost",
  port: 3306,
  username: "ksmin",
  password: "password",
  database: "proj_md",
  synchronize: true,
  logging: true
});

registerProvider<DataSource>({
  provide: MYSQL_DATASOURCE,
  type: "typeorm:datasource",
  deps: [Logger],
  async useAsyncFactory(logger: Logger) {
    await MysqlDatasource.initialize();

    logger.info("Connected with typeorm to database: Mysql");

    return MysqlDatasource;
  },
  hooks: {
    $onDestroy(dataSource) {
      return dataSource.isInitialized && dataSource.close();
    }
  }
});
