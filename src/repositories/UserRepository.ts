import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { User } from "../entities/User";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class UserRepository {
    @Inject(MYSQL_DATASOURCE)
    protected dataSource: DataSource;

    private repository: Repository<User>;

    $onInit() {
        this.repository = this.dataSource.getRepository(User);
    }

    findUserByUUID(uuid: string) {
        return this.repository.findOne({ where: { uuid: uuid } });
    }

    findUserByNickname(nickname: string) {
        return this.repository.findOne({
            where: { nickname: nickname },
            relations: ['units', 'decks', 'stage_perfactions'],
        });
    }

    isUserExists(nickname: string) {
        return this.repository.exists({ where: { nickname: nickname } });
    }

    saveUser(userData: User) {
        return this.repository.save(userData);
    }
}