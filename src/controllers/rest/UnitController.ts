import { Controller, Inject } from "@tsed/di";
import { Item } from "../../entities/Item";
import { BodyParams, QueryParams } from "@tsed/platform-params";
import { UnitService } from "../../services/UnitService";
import { Post } from "@tsed/schema";
import { Equipment } from "../../entities/Equipment";

@Controller("/unit")
export class UnitController{

    @Inject()
    unitService: UnitService;

    @Post("/upgrade-level")
    async upgradeUnitLevel(@QueryParams("input_data") string_data: string){
        const data: RecieveUnitLevelUp = JSON.parse(string_data);
        await this.unitService.upgradeUnitLevel(data.uuid, data.id, data.use_items, data.use_coin, data.updated_exp);
    }

    @Post("/upgrade-skill")
    async upgradeUnitSkill(@QueryParams("input_data") string_data: string) {
        const data: RecieveUnitSkillLevelUp = JSON.parse(string_data);
        await this.unitService.upgradeUnitSkillLevel(data.uuid, data.id, data.use_items, data.use_coin, data.skill_index);
    }

    @Post("/upgrade-rank")
    async upgradeUnitRank(@QueryParams("input_data") string_data: string) {
        const data: RecieveUnitRankUp = JSON.parse(string_data);
        await this.unitService.upgradeUnitRank(data.uuid, data.id, data.use_items, data.use_coin);
    }

    @Post("/test-equipment-add")
    async testEquipmentAdd(@BodyParams("unit_id") unit_id: number, @BodyParams("pos") pos: number) {
        const unit = await this.unitService.findUnitById(unit_id);
        const equipment = new Equipment();
        equipment.place_index = pos;
        unit.addEuquipment(equipment);
        this.unitService.updateUnit(unit);
        return equipment;
    }

    @Post("/test-find-equipment")
    async testFindEquipment(@BodyParams("id") id: number) {
        const unit = await this.unitService.findUnitById(id);
        const equipments = unit.equipments;
        return equipments;
    }
}

export class RecieveUnitLevelUp {
    uuid: string;
    id: number;
    use_items: Item[];
    use_coin: number;
    updated_exp: number;
}

export class RecieveUnitSkillLevelUp{
    uuid: string;
    id: number;
    skill_index: number;
    use_items: Item[];
    use_coin: number;
}

export class RecieveUnitRankUp{
    uuid: string;
    id: number;
    use_items: Item[];
    use_coin: number;
}