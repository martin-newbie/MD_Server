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

}

export class MenuInput{
    user_uuid: string;
}