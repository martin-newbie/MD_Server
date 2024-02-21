import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { InGameService } from "../../services/IngameService";
import { Exception } from "@tsed/exceptions";
import { Unit } from "src/entities/Unit";

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
    async gameEnd(@BodyParams("input_data") data: any) {

        const user = await this.ingameService.getUser(data.uuid);

        if(user === null) {
            throw Exception;
        }

        let resultExp = 0;
        if (data.is_win) {
            this.ingameService.updateStagePerfaction(data.uuid, data.stage_index, data.chapter_index, data.perfaction);
            resultExp = data.use_energy;

            const user = await this.ingameService.getUser(data.uuid);
            user.updateExp(resultExp);
            this.ingameService.saveUser(user);

            const deck = await this.ingameService.getGameDeck(data.uuid, data.deck_index);
            for (let i = 0; i < deck.unit_indexes.length; i++) {
                const unitId = deck.unit_indexes[i];

                if(unitId != -1){
                    const unit = await this.ingameService.getUnit(unitId);
                    unit.updateExp(resultExp);
                    this.ingameService.saveUnit(unit);
                }
            }

        } else {
            // TODO : add 90% energy as item
        }


        return {
            "exp": resultExp,
            "reward": [],
        }

    }
}

export class StageEnterData {
    uuid: string;
    index: number;
    use_energy: number;
}
