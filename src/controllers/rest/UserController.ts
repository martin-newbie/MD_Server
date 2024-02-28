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
        this.userService.updateUser(user);
    }

    @Post("/use-item")
    async useItem(@BodyParams("input_data") string_data: string){
        const data: RecieveGetItem = JSON.parse(string_data);

        const user = await this.userService.findUserIncludeItems(data.uuid);
        const item = new Item(data.item_idx);
        item.count = data.count;
        const findItem = user.useItem(item);

        this.userService.updateUser(user);
        this.userService.updateItem(findItem);
    }

    @Post("/test-get-item")
    async testGetItem(@QueryParams("uuid") uuid: string, @QueryParams("item_idx") item_idx: number, @QueryParams("count") count: number){
        this.getItem(JSON.stringify({"uuid": uuid, "item_idx": item_idx, "count": count}));
    }

    @Post("/test-use-item")
    async testUseItem(@QueryParams("uuid") uuid: string, @QueryParams("item_idx") item_idx: number, @QueryParams("count") count: number){
        this.useItem(JSON.stringify({"uuid": uuid, "item_idx": item_idx, "count": count}));
    }
}

export class RecieveGetItem{
    uuid: string;
    item_idx: number;
    count: number;
}