import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { UserRepository } from "../../repositories/UserRepository";
import { UnitRepository } from "../../repositories/UnitRepository";



@Controller("/main-menu")
export class MainMenuController{

    @Inject()
    userRepos: UserRepository;

    @Inject()
    unitRepos: UnitRepository;

    @Post("/enter-main")
    async enterMain(@BodyParams("input_data") data: string){

    }

    @Post("/enter-list")
    async enterListFromMenu(@BodyParams("input_data") string_data: string){
        const data: RecieveUserData = JSON.parse(string_data);

        const units = (await this.userRepos.findUserByUUIDWithUnitRelation(data.uuid)).units;
        return units;
    }

    @Post("/enter-loadout")
    async enterLoadoutFromMenu(@BodyParams("input_data") string_data: string){
        const data: RecieveUserData = JSON.parse(string_data);

        const decks = (await this.userRepos.findUserByUUIDWithDeckRelation(data.uuid)).decks;
        return decks;
    }
}

export class RecieveUserData{
    public uuid: string;
}