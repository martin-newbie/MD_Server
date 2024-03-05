import { UserService } from '../../services/UserService';
import { Controller, Inject } from "@tsed/di";
import { BodyParams, QueryParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { InGameService, Reward } from "../../services/IngameService";
import { StageResult } from '../../entities/StageResult';
import { User } from '../../entities/User';
import { RecieveUserData } from './MainMenuController';

@Controller("/ingame")
export class InGameController {

    @Inject()
    protected inGameService: InGameService;

    @Inject()
    protected userService: UserService;

    
    @Post("/game-enter")
    async gameEnter(@BodyParams("input_data") string_data: string) {

        const data: RecieveGameEnter = JSON.parse(string_data);
        const user = await this.userService.findUserWithUUID(data.uuid);
        const deck = await this.userService.findUserDeck(data.uuid, data.deck_index);
        const stageData = this.inGameService.findStageData(data.selected_stage, data.selected_chapter);

        user.updateEnergy(-data.energy_use);
        await this.userService.updateUser(user);

        return{
            "success": true,
            "deck": deck,
            "stage_data": stageData,
        };
    }

    @Post("/test-stage")
    async testStage(@QueryParams("stage") stage: number, @QueryParams("chapter") chapter: number) {
        const stageData = this.inGameService.findStageData(stage, chapter);
        return stageData;
    }
    
    @Post("/game-end")
    async gameEnd(@BodyParams("input_data") string_data: string) {

        const data: RecieveGameEnd = JSON.parse(string_data);
        const reward = await this.updateStageResult(data);

        return {
            "is_win": data.is_win,
            "reward": reward,
        }
    }

    @Post("/test-game-end")
    async testGameEnd(@QueryParams("uuid") uuid: string, @QueryParams("condition_1") cond1: boolean, @QueryParams("condition_2") cond2: boolean, @QueryParams("condition_3") cond3: boolean, @QueryParams("stage") stage: number, @QueryParams("chapter") chapter: number) {
        const data = new RecieveGameEnd();
        data.uuid = uuid;
        data.stage_index = stage;
        data.chapter_index = chapter;
        data.is_win = cond3;
        data.perfaction = [cond1, cond2, cond3];
        const reward = await this.updateStageResult(data);

        return {
            "is_win": data.is_win,
            "reward": reward,
        }
    }

    async updateStageResult(data: RecieveGameEnd) {
        const reward: Reward[] = [];

        // TODO : upgrade exp of each deck's units
        // TODO : upgrade user exp

        if (data.is_win) {
            const user = await this.userService.findUserWithStageResult(data.uuid);
            const stageResult = user.stage_result.find((result) => result.chapter_idx == data.chapter_index && result.stage_idx == data.stage_index);

            if (data.perfaction[0] && data.perfaction[1] && data.perfaction[2]) {
                if (!stageResult) {
                    // 초회 3별
                    reward.push(new Reward(1, 0, 30));
                } else if (stageResult.isAllConditionTrue()) {
                    // 중복 3별
                } else {
                    // 재도전 3별
                    reward.push(new Reward(1, 0, 30));
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
                }
            }
            await this.userService.updateUser(user);

        } else {
            // give back used energy
            reward.push(new Reward(1, 1, Math.floor(data.use_energy * 0.9)));
        }

        return reward;
    }


}

export class RecieveGameEnter{
    uuid: string;
    deck_index: number;
    selected_stage: number;
    selected_chapter: number;
    energy_use: number;
}

export class RecieveGameEnd{
    uuid: string;
    stage_index: number;
    chapter_index: number;
    is_win: boolean;
    perfaction: boolean[];
    use_energy: number;
    deck_index: number;
}