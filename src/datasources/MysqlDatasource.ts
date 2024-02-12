import { registerProvider } from "@tsed/di";
import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";

export const rootDir = __dirname;


const db_name = process.env.DB_NAME || 'localhost';
const db_user = process.env.DB_USER || 'ksmin';
const db_pass = process.env.DB_PASS || 'password';

export const MYSQL_DATASOURCE = Symbol.for("MysqlDatasource");
export const MysqlDatasource = new DataSource({
  type: "mysql",
  entities: [
    `${rootDir}/../entities/*{.ts,.js}`
  ],
  host: db_name,
  port: 3306,
  username: db_user,
  password: db_pass,
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
