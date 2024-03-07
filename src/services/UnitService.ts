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
}