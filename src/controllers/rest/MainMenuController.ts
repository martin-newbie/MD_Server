import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { UserRepository } from "../../repositories/UserRepository";

@Controller("/main-menu")
export class MainMenuController{

    @Inject()
    userRepos: UserRepository;

    @Post("/enter-main")
    async enterMain(@BodyParams("input_data") data: string){

    }

    @Post("/enter-list")
    async enterListFromMenu(@BodyParams("input_data") string_data: string){
        const data: RecieveUserData = JSON.parse(string_data);

        const units = await this.userRepos.findUserUnits(data.uuid);
        return units;
    }

    @Post("/enter-loadout")
    async enterLoadoutFromMenu(@BodyParams("input_data") string_data: string){
        const data: RecieveUserData = JSON.parse(string_data);

        const decks = await this.userRepos.findUserDecks(data.uuid);
        return decks;
    }
}

export class RecieveUserData{
    public uuid: string;
}