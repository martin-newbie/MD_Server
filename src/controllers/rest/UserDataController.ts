import { Controller, Inject } from "@tsed/di";
import { QueryParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { UserDataService } from "../../services/UserDataService";

@Controller("/User_Data")
export class UserDataController{
    @Inject()
    protected userDataService: UserDataService;

    @Post("/Test_Server_Login/")
    async login(@QueryParams("nickname") nickname: string){

        let isError = false;

        if(nickname === "" || nickname === null){
            isError = true;
        }

        const userData = await this.userDataService.testLoginWithNickname(nickname);

        return {
            "isError": isError,
            "userData": userData
        }
    }
}