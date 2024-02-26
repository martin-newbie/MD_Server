import { Inject, Injectable } from "@tsed/di";
import { User } from "../entities/User";
import { Exception } from "@tsed/exceptions";
import { StagePerfaction } from "../entities/StagePerfaction";
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

    async findUserByUUID(uuid: string) {
        return await this.repository.findOne({ where: { uuid: uuid } });
    }

    async findUserByUUIDWithUnitRelation(uuid: string) {
        const user = await this.repository.findOne({
            where: { uuid: uuid },
            relations: ['units'],
        });

        if(user === null || user === undefined){
            throw Exception;
        }

        user.units.forEach(unit => {
            unit.skill_level = [unit.skill_level_0, unit.skill_level_1, unit.skill_level_2, unit.skill_level_3];
        });

        return user.units;
    }

    async findUserByUUIDWithDeckRelation(uuid: string){
        const user = await this.repository.findOne({
            where: { uuid: uuid },
            relations: ['decks'],
        });

        if(user === null || user === undefined){
            throw Exception;
        }
        
        user.decks.forEach(deck => {
            deck.unit_indexes = [deck.unit1, deck.unit2, deck.unit3, deck.unit4, deck.unit5];
        });

        return user.decks;
    }

    async findUserByNicknameWithAllRelation(nickname: string) {
        return await this.repository.findOne({
            where: { nickname: nickname },
            relations: ['units', 'decks', 'stage_perfactions'],
        });
    }

    async isUserExists(nickname: string) {
        return await this.repository.exists({ where: { nickname: nickname } });
    }

    async saveUser(userData: User) {
        return await this.repository.save(userData);
    }
    
    async updateStagePerfaction(user: User, stage_index: number, chapter_index: number, perfaction: boolean[]) {

        let stagePerfaction = user.stage_perfactions.find(item => item.stage_idx === stage_index && item.chapter_idx === chapter_index);

        if(stagePerfaction === undefined || stagePerfaction === null) {
            stagePerfaction = new StagePerfaction();
            stagePerfaction.stage_idx = stage_index;
            stagePerfaction.chapter_idx = chapter_index;
            user.stage_perfactions.push(stagePerfaction);
        }
        
        stagePerfaction.condition_1 = perfaction[0];
        stagePerfaction.condition_2 = perfaction[1];
        stagePerfaction.condition_3 = perfaction[2];
        
        
    }
}