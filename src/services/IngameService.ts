import { Inject, Injectable } from "@tsed/di";
import { UserRepository } from "../repositories/UserRepository";
import * as fs from 'fs';

@Injectable()
export class InGameService{

    @Inject()
    protected userRepos: UserRepository;
    
    findStageData(stage: number, chapter: number) {
        const path = `./src/data/stage/${chapter}.json`;
        const data = fs.readFileSync(path, 'utf8');
        const chapterData: chapterData = JSON.parse(data);
        return chapterData.stageDatas[stage];
    }
    
    getStageReward(stage: number, chapter: number): Reward[] {
        const rewardData = this.getStageRewardData(stage, chapter);

        const rewards: Reward[] = [];
        rewardData.datas.forEach(data => {
            if(this.calculateRewardAcquire(data)){
                const reward = new Reward(data.type, data.idx, this.calculateRewardCount(data));
                rewards.push(reward);
            }
        });

        return rewards;
    }

    private calculateRewardAcquire(data: RewardData) {
        if(Math.random() > data.acquire_range) {
            return false;
        } else {
            return true;
        }
    }

    private calculateRewardCount(data: RewardData) {
        return Math.floor(Math.random() * (data.count_max - data.count_min) + data.count_min);
    }

    private getStageRewardData(stage: number, chapter: number): StageReward {
        const path = `./src/data/reward/${chapter}.json`;
        const data = fs.readFileSync(path, 'utf8');
        const rewardData : ChapterReward = JSON.parse(data);

        return rewardData.datas[stage];
    } 
}

export class ChapterReward {
    chapter: number;
    datas: StageReward[];
}

export class StageReward {
    datas: RewardData[];
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