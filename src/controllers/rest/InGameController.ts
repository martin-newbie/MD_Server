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