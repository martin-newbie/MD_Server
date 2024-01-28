import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { TestIngameService } from "../../services/TestIngameService";

@Controller("/test-ingame")
export class TestModeGameController {
    @Inject()
    protected ingameService: TestIngameService;

    @Post("/game-enter")
    async gameEnter(@BodyParams("input_data") input_data: string) {
        const data: IndexAndUUID = JSON.parse(input_data);
        var deck = await this.ingameService.getGameDeck(data.uuid, data.index);
        return deck;
    }

    @Post("/game-end")
    async gameEnd(@BodyParams("input_data") input_data: string) {
        const data: GameResultData = JSON.parse(input_data);
        
    }
}

export class IndexAndUUID {
    uuid: string;
    index: number;
}

export class GameResultData {
    isClear: boolean;
    isNoCasualties: boolean;
    isMakeInTime: boolean;
}