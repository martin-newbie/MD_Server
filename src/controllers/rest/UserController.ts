import { Controller, Inject } from "@tsed/di";
import { BodyParams, QueryParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { UserService } from "../../services/UserService";
import { Item } from "../../entities/Item";

@Controller("/user")
export class UserController{
    @Inject()
    protected userService: UserService;

    @Post("/login")
    async login(@BodyParams("input_data") nickname: string){

        let isError = false;
        console.log(nickname);

        if (nickname === "" || nickname === null || nickname === undefined) {
            throw {
                "code": 400,
                "message": "nickname is required"
            };
        }

        const userData = await this.userService.testLoginWithNickname(nickname);
        return {
            "isError": isError,
            "userData": userData,
        }
    }

    @Post("/get-item")
    async getItem(@BodyParams("input_data") string_data: string){
        const data: RecieveGetItem = JSON.parse(string_data);

        const user = await this.userService.findUserWithUUID(data.uuid);
        const item = new Item(data.item_idx);
        item.count = data.count;
        user.addItem(item);
    }

    @Post("/use-item")
    async useItem(@BodyParams("input_data") string_data: string){
        const data: RecieveGetItem = JSON.parse(string_data);

        const user = await this.userService.findUserWithUUID(data.uuid);
        const item = new Item(data.item_idx);
        item.count = data.count;
        user.useItem(item);
    }

    @Post("/test-get-item")
    async testGetItem(@QueryParams("uuid") uuid: string, @QueryParams("item_idx") item_idx: number, @QueryParams("count") count: number){
        const user = await this.userService.findUserWithUUID(uuid);
        const item = new Item(item_idx);
        item.count = count;
        user.addItem(item);
    }

    @Post("/test-use-item")
    async testUseItem(@QueryParams("uuid") uuid: string, @QueryParams("item_idx") item_idx: number, @QueryParams("count") count: number){
        const user = await this.userService.findUserWithUUID(uuid);
        const item = new Item(item_idx);
        item.count = count;
        user.useItem(item);
    }
}

export class RecieveGetItem{
    uuid: string;
    item_idx: number;
    count: number;
}