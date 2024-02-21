import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { InGameService } from "../../services/IngameService";

@Controller("/ingame")
export class InGameController {

    @Inject()
    protected ingameService: InGameService;

    @Post("/game-enter")
    async gameEnter(@BodyParams("input_data") input_data: string) {
        const data: StageEnterData = JSON.parse(input_data);
        var deck = await this.ingameService.getGameDeck(data.uuid, data.index);
        return deck;
    }

    @Post("/stage-game-enter")
    async stageGameEnter(@BodyParams("input_data") input_data: any) {

        const stageData: StageEnterData = input_data;

        const deck = await this.ingameService.getGameDeck(stageData.uuid, stageData.index);
        const user = await this.ingameService.getUser(stageData.uuid);

        if (user === null || user.getEnergy() < stageData.use_energy) {
            return {
                "is_error": true,
            };
        }

        user.updateEnergy(-stageData.use_energy);

        return {
            "deck": deck,
        }
    }

    @Post("/game-end")
    async gameEnd(@BodyParams("input_data") input_data: string) {

    }
}

export class StageEnterData {
    uuid: string;
    index: number;
    use_energy: number;
}
