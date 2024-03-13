import { Controller } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Get, Post } from "@tsed/schema";
import fs from 'fs';

@Controller('/data')
export class DataController{

    @Post('/upload-data')
    async uploadData(@BodyParams('input_data') string_data: string) {
        const data: RecieveUploadData = JSON.parse(string_data);
        const path = `src/data/${data.title}.txt`;
        if(!fs.existsSync(path)){
            fs.writeFileSync(path, '', 'utf8');
        }
        fs.writeFileSync(path, data.data, 'utf8');
    }

    @Post('/game-data')
    async gameData(){
        return {
            common_skill_data : JSON.parse(fs.readFileSync('src/data/CommonSkill.txt', 'utf8')),
            active_skill_data : JSON.parse(fs.readFileSync('src/data/ExSkillItem.txt', 'utf8')),
            tier_upgrade_data : JSON.parse(fs.readFileSync('src/data/TierData.txt', 'utf8')),
            user_exp_data : JSON.parse(fs.readFileSync('src/data/UserExp.txt', 'utf8')),
            unit_exp_data : JSON.parse(fs.readFileSync('src/data/UnitExp.txt', 'utf8')),
            equipment_exp_data : JSON.parse(fs.readFileSync('src/data/EquipmentExp.txt', 'utf8')),
        }
    }
}

export class RecieveUploadData{
    title: string;
    data: string;
}

export class ExpData{
    exp: number[] = [];
}