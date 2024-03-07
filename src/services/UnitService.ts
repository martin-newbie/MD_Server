import { Inject, Injectable } from "@tsed/di";
import { UnitRepository } from "../repositories/UnitRepository";
import { UserRepository } from "../repositories/UserRepository";
import { Exception } from "@tsed/exceptions";
import { Item } from "../entities/Item";

@Injectable()
export class UnitService {
    @Inject()
    unitRepos: UnitRepository;
    @Inject()
    userRepos: UserRepository;

    async upgradeUnitLevel(uuid: string, id: number, use_items: Item[], use_coin: number, updated_exp: number) {
        const user = await this.userRepos.findUserByUUID(uuid);
        if (!user) throw new Exception(400, "no user available!");
        const unit = await this.unitRepos.findWithId(id);
        if (!unit) throw new Exception(400, "no unit available!");

        unit.updateExp(updated_exp);
        use_items.forEach(item => {
            user.useItem(item);
        });
        user.coin -= use_coin;

        await this.unitRepos.saveUnit(unit);
        await this.userRepos.saveUser(user);
    }

    async upgradeUnitSkillLevel(uuid: string, id: number, use_items: Item[], use_coin: number, skill_index: number) {
        const user = await this.userRepos.findUserByUUID(uuid);
        if (!user) throw new Exception(400, "no user available!");
        const unit = await this.unitRepos.findWithId(id);
        if (!unit) throw new Exception(400, "no unit available!");

        switch (skill_index) {
            case 0: unit.skill_level_0++; break;
            case 1: unit.skill_level_1++; break;
            case 2: unit.skill_level_2++; break;
            case 3: unit.skill_level_3++; break;
        }

        use_items.forEach(item => {
            user.useItem(item);
        });
        user.coin -= use_coin;

        await this.unitRepos.saveUnit(unit);
        await this.userRepos.saveUser(user);
    }

    async upgradeUnitRank(uuid: string, id: number, use_items: Item[], use_coin: number) {
        const user = await this.userRepos.findUserByUUID(uuid);
        if (!user) throw new Exception(400, "no user available!");
        const unit = await this.unitRepos.findWithId(id);
        if (!unit) throw new Exception(400, "no unit available!");

        unit.rank++;
        use_items.forEach(item => {
            user.useItem(item);
        });
        user.coin -= use_coin;

        await this.unitRepos.saveUnit(unit);
        await this.userRepos.saveUser(user);
    }
}