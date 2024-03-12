import { Controller, Inject } from "@tsed/di";
import { Item } from "../../entities/Item";
import { BodyParams, QueryParams } from "@tsed/platform-params";
import { UnitService } from "../../services/UnitService";
import { Post } from "@tsed/schema";

@Controller("/unit")
export class UnitController{

    @Inject()
    unitService: UnitService;

    @Post("/upgrade-level")
    async upgradeUnitLevel(@BodyParams("input_data") string_data: string){
        const data: RecieveUnitLevelUp = JSON.parse(string_data);
        await this.unitService.upgradeUnitLevel(data.uuid, data.id, data.use_items, data.use_coin, data.updated_exp);
    }

    @Post("/upgrade-skill")
    async upgradeUnitSkill(@BodyParams("input_data") string_data: string) {
        const data: RecieveUnitSkillLevelUp = JSON.parse(string_data);
        await this.unitService.upgradeUnitSkillLevel(data.uuid, data.id, data.use_items, data.use_coin, data.skill_index);
    }

    @Post("/upgrade-rank")
    async upgradeUnitRank(@BodyParams("input_data") string_data: string) {
        const data: RecieveUnitRankUp = JSON.parse(string_data);
        await this.unitService.upgradeUnitRank(data.uuid, data.id, data.use_items, data.use_coin);
    }
    
    @Post("/upgrade-equipment")
    async upgradeEquipment(@BodyParams("input_data") string_data: string) {
        const data: RecieveEquipmentUp = JSON.parse(string_data);
        await this.unitService.upgradeUnitEqupment(data.uuid, data.id, data.use_items, data.use_coin, data.place, data.update_exp);
    }

    @Post("/upgrade-equipment-tier")
    async upgradeEquipmentTier(@BodyParams("input_data") string_data: string) {
        const data: RecieveEquipmentTierUp = JSON.parse(string_data);
        await this.unitService.upgradeUnitEquipmentTier(data.uuid, data.id, data.use_items, data.use_coin, data.place);
    }

    @Post("/test-equipment-upgrade")
    async testUpgrade(){
        const uuid = "84a543d9-3b7b-4365-a278-045b4df3292d";
        const id = 1;
        const use_items: Item[] = [];
        const use_coin = 0;
        const place = 0;
        const result = await this.unitService.upgradeUnitEquipmentTier(uuid, id, use_items, use_coin, place);
        return result;
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

export class RecieveEquipmentUp{
    uuid: string;
    id: number;
    place: number;
    use_items: Item[];
    use_coin: number;
    update_exp: number;
}

export class RecieveEquipmentTierUp{
    uuid: string;
    id: number;
    place: number;
    use_items: Item[];
    use_coin: number;
}