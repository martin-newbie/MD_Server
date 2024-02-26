import { Inject, Injectable } from "@tsed/di";
import { User } from "../entities/User";
import { Exception } from "@tsed/exceptions";
import { DataSource, Repository } from "typeorm";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";

@Injectable()
export class UserRepository {

    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    repository: Repository<User>;

    $onInit() {
        this.repository = this.datasource.getRepository(User);
    }

    findUserByUUID(uuid: string) {
        return this.repository.findOne({ where: { uuid: uuid } });
    }
    isUserExists(nickname: string) {
        return this.repository.exists({ where: { nickname: nickname } });
    }

    saveUser(userData: User) {
        return this.repository.save(userData);
    }

    findUserByNicknameWithAllRelation(nickname: string) {
        return this.repository.findOne({
            where: { nickname: nickname },
            relations: ['units', 'decks', 'stage_perfactions'],
        });
    }

    findUserUnits(uuid: string) {
        return this.repository.findOne({
            where: { uuid: uuid },
            relations: ['units'],
        });
    }

    findUserDecks(uuid: string) {
        return this.repository.findOne({
            where: { uuid: uuid },
            relations: ['decks'],
        });
    }

    findUserStagePerfactions(uuid: string) {
        return this.repository.findOne({
            where: { uuid: uuid },
            relations: ['stage_perfactions'],
        });
    }
}