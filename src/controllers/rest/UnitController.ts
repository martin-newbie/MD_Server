import { Controller, Inject } from "@tsed/di";
import { Item } from "../../entities/Item";
import { QueryParams } from "@tsed/platform-params";

@Controller("/unit")
export class UnitController{

    async upgradeUnitLevel(@QueryParams("input_data") string_data: string){
        const data: RecieveUnitLevelUp = JSON.parse(string_data);
        
    }

    async upgradeUnitSkill(@QueryParams("input_data") string_data: string) {
        const data: RecieveUnitSkillLevelUp = JSON.parse(string_data);
    }

    async upgradeUnitRank(@QueryParams("input_data") string_data: string) {
        const data: RecieveUnitRankUp = JSON.parse(string_data);
    }
}

export class RecieveUnitLevelUp {
    uuid: string;
    id: number;
    use_items: Item[];
    use_bond: number;
    updated_exp: number;
}

export class RecieveUnitSkillLevelUp{
    uuid: string;
    id: number;
    skill_index: number;
    use_items: Item[];
    use_bond: number;
}

export class RecieveUnitRankUp{
    uuid: string;
    id: number;
    use_items: Item[];
    use_bond: number;
}