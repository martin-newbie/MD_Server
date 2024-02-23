import { UserService } from './../../services/UserService';
import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { InGameService } from "../../services/IngameService";
import { Exception } from "@tsed/exceptions";

@Controller("/ingame")
export class InGameController {

    @Inject()
    protected inGameService: InGameService;

    @Inject()
    protected userService: UserService;

    @Post("/game-enter")
    async gameEnter(@BodyParams("input_data") data: any) {

        const user = await this.userService.findUserWithUUID(data.uuid);
        const usedEnergy = data.energy_use;
        const energy = user.getEnergy();

        if(energy < usedEnergy){
            throw Exception;
        }

        user.updateEnergy(-usedEnergy);
        const deck = await this.inGameService.getGameDeck(data.uuid, data.deck_index);

        return{
            "success": true,
            "current_energy": user.getEnergy(),
            "energy_updated_at": user.last_energy_updated,
            "deck": deck,
            "stage_data": "",
            "selected_stage": data.selected_stage,
            "selected_chapter": data.selected_chapter,
        };
    }
    
    @Post("/game-end")
    async gameEnd(@BodyParams("input_data") data: any) {

        const user = await this.inGameService.getUser(data.uuid);

        if(user === null) {
            throw Exception;
        }

        let resultExp = 0;
        if (data.is_win) {
            this.inGameService.updateStagePerfaction(data.uuid, data.stage_index, data.chapter_index, data.perfaction);
            resultExp = data.use_energy;

            const user = await this.inGameService.getUser(data.uuid);
            user.updateExp(resultExp);
            this.inGameService.saveUser(user);

            const deck = await this.inGameService.getGameDeck(data.uuid, data.deck_index);
            for (let i = 0; i < deck.unit_indexes.length; i++) {
                const unitId = deck.unit_indexes[i];

                if(unitId != -1){
                    const unit = await this.inGameService.getUnit(unitId);
                    unit.updateExp(resultExp);
                    this.inGameService.saveUnit(unit);
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
