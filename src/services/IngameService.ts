import { Inject, Injectable } from "@tsed/di";
import { UserRepository } from "../repositories/UserRepository";
import * as fs from 'fs';
import { RecieveGameEnd } from "../controllers/rest";
import { UserService } from "./UserService";
import { StageResult } from "../entities/StageResult";

@Injectable()
export class InGameService{

    @Inject()
    protected userRepos: UserRepository;
    
    @Inject()
    protected userService: UserService;

    findStageData(stage: number, chapter: number) {
        const path = `./src/data/stage/${chapter}.json`;
        const data = fs.readFileSync(path, 'utf8');
        const chapterData: chapterData = JSON.parse(data);
        return chapterData.stageDatas[stage];
    }
    
    async updateStageResult(data: RecieveGameEnd) {
        const reward: Reward[] = [];
        const user = await this.userService.findUserWithStageResult(data.uuid);

        // TODO : upgrade exp of each deck's units
        // TODO : upgrade user exp

        if (data.is_win) {
            const stageResult = user.stage_result.find((result) => result.chapter_idx == data.chapter_index && result.stage_idx == data.stage_index);

            if (data.perfaction[0] && data.perfaction[1] && data.perfaction[2]) {
                if (!stageResult) {
                    // 초회 3별
                    reward.push(new Reward(1, 0, 40));
                } else if (stageResult.isAllConditionTrue()) {
                    // 중복 3별
                } else {
                    // 재도전 3별
                    reward.push(new Reward(1, 0, 40));
                }
            }

            if (!stageResult) {
                const result = new StageResult();
                result.chapter_idx = data.chapter_index;
                result.stage_idx = data.stage_index;
                result.condition_1 = data.perfaction[0];
                result.condition_2 = data.perfaction[1];
                result.condition_3 = data.perfaction[2];
                reward.push(new Reward(1, 0, 30));
                user.addStageResult(result);
            } else {
                if (!stageResult.isAllConditionTrue()) {
                    // 3별이 아니면 갱신
                    stageResult.condition_1 = stageResult.condition_1 || data.perfaction[0];
                    stageResult.condition_2 = stageResult.condition_2 || data.perfaction[1];
                    stageResult.condition_3 = stageResult.condition_3 || data.perfaction[2];
                    this.userService.updateStageResult(stageResult);
                }
            }

        } else {
            // give back used energy
            reward.push(new Reward(1, 1, Math.floor(data.use_energy * 0.9)));
        }

        await this.userService.applyReward(user, reward);
        return reward;
    }

}

export class RewardData{
    acquire_range: number;      // 0 ~ 1
    count_min: number;
    count_max: number;
    
    type: number;               // 0: item, 1: currency, 2: character
    idx: number;
}

export class Reward{
    type: number;           // 0: item, 1: currency, 2: character
    index: number;
    count: number;

    constructor(_type: number, _idx: number, _count: number){
        this.type = _type;
        this.index = _idx;
        this.count = _count;
    }
}

export class chapterData{
    chapterIndex: number;
    stageDatas: stageData[];
}

export class stageData{
    chapterIndex: number;
    stageIndex: number;
    stageLevel: number;
    waveDatas: waveData[];
}

export class waveData{
    unitDatas: waveUnitData[];
}

export class waveUnitData{
    index: number;
    level: number;
    unit_type: number;
}