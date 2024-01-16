import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { UserDataModel } from "../models/UserDataModel";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class UserDataRepository {
    @Inject(MYSQL_DATASOURCE)
    protected dataSource: DataSource;

    private repository: Repository<UserDataModel>;

    $onInit() {
        this.repository = this.dataSource.getRepository(UserDataModel);
    }

    findUserByUUID(uuid: string) {
        return this.repository.find({ where: { uuid: uuid } });
    }

    findUserByNickname(nickname: string) {
        return this.repository.find({ where: { userNickname: nickname } });
    }

    addNewUser(userData: UserDataModel) {
        return this.repository.save(userData);
    }

    isUserNicknameExist(nickname: string) {
        return this.repository.exists({ where: { userNickname: nickname } });
    }
}