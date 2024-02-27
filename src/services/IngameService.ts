import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { DataSource } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import * as fs from 'fs';

@Injectable()
export class InGameService{

    @Inject()
    protected userRepos: UserRepository;
    
    findStageData(stage: number, chapter: number){
        const path = `./src/data/stage/${chapter}.json`;
        const data = fs.readFileSync(path, 'utf8');
        const chapterData: chapterData = JSON.parse(data);
        return chapterData.stageDatas[stage];
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