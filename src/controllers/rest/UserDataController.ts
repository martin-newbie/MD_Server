import { Controller, Inject } from "@tsed/di";
import { QueryParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { UserDataService } from "../../services/UserDataService";

@Controller("/User-Data")
export class UserDataController{
    @Inject()
    protected userDataService: UserDataService;

    @Post("/LoginWithNickname")
    create(@QueryParams() nickname: string){
        return this.userDataService.testLoginWithNickname(nickname);
    }
}