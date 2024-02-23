import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { UserService } from "../../services/UserService";
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