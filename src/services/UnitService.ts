import { Inject, Injectable } from "@tsed/di";
import { UnitRepository } from "../repositories/UnitRepository";
import { UserRepository } from "../repositories/UserRepository";
import { Item } from "../entities/Item";
import { User } from "../entities/User";
import { Unit } from "../entities/Unit";

@Injectable()
export class UnitService {
    @Inject()
    unitRepos: UnitRepository;
    @Inject()
    userRepos: UserRepository;

    async upgradeUnitLevel(uuid: string, id: number, use_items: Item[], use_coin: number, updated_exp: number) {
        const user = await this.userRepos.findUserByUUID(uuid);
        const unit = await this.unitRepos.findWithId(id);

        unit.updateExp(updated_exp);
        this.useItem(user, use_items, use_coin);
        await this.saveData(user, unit);
    }

    async upgradeUnitSkillLevel(uuid: string, id: number, use_items: Item[], use_coin: number, skill_index: number) {
        const user = await this.userRepos.findUserByUUID(uuid);
        const unit = await this.unitRepos.findWithId(id);

        switch (skill_index) {
            case 0: unit.skill_level_0++; break;
            case 1: unit.skill_level_1++; break;
            case 2: unit.skill_level_2++; break;
            case 3: unit.skill_level_3++; break;
        }

        this.useItem(user, use_items, use_coin);
        await this.saveData(user, unit);
    }

    async upgradeUnitRank(uuid: string, id: number, use_items: Item[], use_coin: number) {
        const user = await this.userRepos.findUserByUUID(uuid);
        const unit = await this.unitRepos.findWithId(id);

        unit.rank++;
        this.useItem(user, use_items, use_coin);
        await this.saveData(user, unit);
    }

    private useItem(user: User, items: Item[], coin: number) {
        items.forEach(item => {
            user.useItem(item);
        });
        user.coin -= coin;
    }

    private async saveData(user: User, unit: Unit) {
        await this.unitRepos.saveUnit(unit);
        await this.userRepos.saveUser(user);
    }
}