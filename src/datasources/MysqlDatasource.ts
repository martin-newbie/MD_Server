import {registerProvider} from "@tsed/di";
import {DataSource} from "typeorm";
import {Logger} from "@tsed/logger";
import { envs } from "src/config/envs";

export const MYSQL_DATASOURCE = Symbol.for("MysqlDatasource");
export const MysqlDatasource = new DataSource({
  type: "mysql",
  entities: [],
  host: "localhost",
  port: 3306,
  //@ts-ignore
  username: envs.database.username,
  password: "test",
  database: "test"
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
