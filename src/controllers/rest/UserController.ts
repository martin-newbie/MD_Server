import { Controller, Inject } from "@tsed/di";
import { QueryParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { UserService } from "../../services/UserService";

@Controller("/user")
export class UserController{
    @Inject()
    protected userService: UserService;

    @Post("/login")
    async login(@QueryParams("nickname") nickname: string){

        let isError = false;

        if(nickname === "" || nickname === null){
            isError = true;
        }

        const userData = await this.userService.testLoginWithNickname(nickname);
        return {
            "isError": isError,
            "userData": userData,
        }
    }
}