import { Controller, Inject } from "@tsed/di";
import { QueryParams } from "@tsed/platform-params";
import { Get, Post } from "@tsed/schema";
import { UserService } from "../../services/UserService";

@Controller("/user")
export class UserController{
    @Inject()
    protected userDataService: UserService;

    @Post("/login")
    async login(@QueryParams("nickname") nickname: string){

        let isError = false;

        if(nickname === "" || nickname === null){
            isError = true;
        }

        const userData = await this.userDataService.testLoginWithNickname(nickname);
        console.log(userData);
        return {
            "isError": isError,
            "userData": userData,
        }
    }
}