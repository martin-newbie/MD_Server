import { Inject, Injectable } from "@tsed/di";
import { UnitRepository } from "../repositories/UnitRepository";
import { UserRepository } from "../repositories/UserRepository";
import { Item } from "../entities/Item";
import { User } from "../entities/User";
import { Unit } from "../entities/Unit";
import { Exception } from "@tsed/exceptions";
import { EquipmentRepository } from "../repositories/EquipmentRepository";
import { ItemRepository } from "../repositories/ItemRepository";

@Injectable()
export class UnitService {
    
    @Inject()
    unitRepos: UnitRepository;
    @Inject()
    userRepos: UserRepository;
    @Inject()
    equipmentRepos: EquipmentRepository;
    @Inject()
    itemRepos: ItemRepository;

    async upgradeUnitLevel(uuid: string, id: number, use_items: Item[], use_coin: number, updated_exp: number) {
        const user = await this.userRepos.findUserByUUID(uuid);
        const unit = await this.unitRepos.findWithId(id);

        unit.updateExp(updated_exp);
        this.useItem(user, use_items, use_coin);
        await this.saveData(unit);
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
        await this.saveData(unit);
    }

    async upgradeUnitRank(uuid: string, id: number, use_items: Item[], use_coin: number) {
        const user = await this.userRepos.findUserByUUID(uuid);
        const unit = await this.unitRepos.findWithId(id);

        unit.rank++;
        this.useItem(user, use_items, use_coin);
        await this.saveData(unit);
    }

    async upgradeUnitEqupment(uuid: string, id: number, use_items: Item[], use_coin: number, place: number, update_exp: number) {
        const user = await this.userRepos.findUserByUUID(uuid);
        const unit = await this.unitRepos.findWithId(id);
        const equipment = unit.equipments.find(e => e.place_index === place);
        equipment?.updateExp(update_exp);
        this.useItem(user, use_items, use_coin);
        await this.saveData(unit);
    }

    async upgradeUnitEquipmentTier(uuid: string, id: number, use_items: Item[], use_coin: number, place: number) {
        const user = await this.userRepos.findUserByUUID(uuid);
        const unit = await this.unitRepos.findWithId(id);
        const equipment = unit.equipments.find(e => e.place_index === place);
        if(!equipment) throw new Exception(400, "no equipment available");

        equipment.tier++;
        await this.useItem(user, use_items, use_coin);
        await this.saveData(unit);
        await this.equipmentRepos.updateEquipment(equipment);
        return equipment;
    }

    async findUnitById(id: number) {
        return await this.unitRepos.findWithId(id);
    }

    async updateUnit(unit: Unit){
        return await this.unitRepos.saveUnit(unit);
    }

    private async useItem(user: User, items: Item[], coin: number) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            await this.updateItem(user.useItem(item));
        }
        user.coin -= coin;
        this.userRepos.saveUser(user);
    }

    private async saveData(unit: Unit) {
        await this.unitRepos.saveUnit(unit);
    }

    private async updateItem(item: Item){
        await this.itemRepos.updateItem(item);
    }
}