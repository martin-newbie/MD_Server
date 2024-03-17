import { Inject, Injectable } from "@tsed/di";
import { User } from "../entities/User";
import { DataSource, Repository } from "typeorm";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { Reward } from "../services/IngameService";
import { Item } from "../entities/Item";
import { Exception } from "@tsed/exceptions";
import { Unit } from "../entities/Unit";

@Injectable()
export class UserRepository {

    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    repository: Repository<User>;

    $onInit() {
        this.repository = this.datasource.getRepository(User);
    }

    async findUserByUUID(uuid: string) {
        const user = await this.repository.findOne({ where: { uuid: uuid }, relations: ['items'] });
        if(!user) throw new Exception(400, "no user available!");
        return user;
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
            relations: ['units', 'units.equipments', 'decks', 'stage_result', 'items'],
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
            relations: ['decks', 'units'],
        });
    }

    findUserItems(uuid: string){
        return this.repository.findOne({
            where: {uuid: uuid},
            relations: ['items']
        });
    }

    findUserStageResult(uuid: string){
        return this.repository.findOne({
            where: {uuid: uuid},
            relations: ['stage_result']
        });
    }
    
    async applyReward(user: User, rewards: Reward[]) {

        for (let i = 0; i < rewards.length; i++) {
            const reward = rewards[i];
            switch (reward.type) {
                case 0:
                    const item = new Item(reward.index);
                    item.count = reward.count;
                    user.addItem(item);
                    break;
                case 1:
                    user.updateCurrency(reward.index, reward.count);
                    break;
                case 2:
                    const units = (await this.findUserUnits(user.uuid))?.units;
                    if(!units) throw Exception;

                    if (!units.some(unit => unit.index === reward.index)) {
                        user.addUnit(new Unit(reward.index));
                    } else {
                        // TODO : add duplicated unit item
                    }
                    break;
            }
        }

        await this.saveUser(user);
    }
}