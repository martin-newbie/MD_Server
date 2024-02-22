import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { UserService } from "../../services/UserService";
import { Exception } from "@tsed/exceptions";
import { InGameService } from "../../services/IngameService";



@Controller("/game-menu")
export class TestMenuController{

    @Inject()
    protected userService: UserService;
    
    @Inject()
    protected inGameService: InGameService;

    @Post("/menu-enter")
    async menuEnter(@BodyParams("input_data") input_data: string){
        return null;
    }

    @Post("/into-stage")
    async tryIntoStage(@BodyParams("input_data") data: any){
        const user = await this.userService.findUserWithUUID(data.uuid);
        const usedEnergy = data.energy_use;
        const energy = user.getEnergy();

        if(energy < usedEnergy){
            throw Exception;
        }

        user.updateEnergy(-usedEnergy);
        const deck = this.inGameService.getGameDeck(data.uuid, data.deck_index);

        return{
            "success": true,
            "current_energy": user.getEnergy(),
            "energy_updated_at": user.last_energy_updated,
            "deck": deck,
            "stage_data": "",
        };
    }

    @Post("/into-story")
    async tryIntoStory(){

    }

    @Post("/into-raid")
    async tryIntoRaid(){

    }

    @Post("/into-pvp")
    async tryIntoPvp(){

    }

    @Post("/into-dungeon")
    async tryIntoDungeon(){

    }

}

export class MenuInput{
    user_uuid: string;
}