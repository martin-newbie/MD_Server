import { UserService } from '../../services/UserService';
import { Controller, Inject } from "@tsed/di";
import { BodyParams, QueryParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { InGameService } from "../../services/IngameService";

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
        const reward = await this.inGameService.updateStageResult(data);
        const units = await this.inGameService.updateExp(data.uuid, data.deck_index, data.use_energy);

        return {
            "is_win": data.is_win,
            "reward": reward,
            "exp": data.use_energy,
            "units": units,
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
        const reward = await this.inGameService.updateStageResult(data);

        return {
            "is_win": data.is_win,
            "reward": reward,
        }
    }

    @Post("/test-exp")
    async testExp(@QueryParams("uuid") uuid: string, @QueryParams("deck_index") deckIndex: number, @QueryParams("exp") exp: number) {
        const response = await this.inGameService.updateExp(uuid, deckIndex, exp);
        return {
            "success": true,
            "response": response,
        }
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