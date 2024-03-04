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