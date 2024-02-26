import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { UserService } from "../../services/UserService";



@Controller("/game-menu")
export class LobbyController{

    @Inject()
    protected userService: UserService;
    
    @Post("/menu-enter")
    async menuEnter(@BodyParams("input_data") input_data: string){
        return null;
    }

    @Post("/into-stage")
    async tryIntoStage(@BodyParams("input_data") data: string){
        return null;
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