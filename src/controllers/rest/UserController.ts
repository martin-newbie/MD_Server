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

        if (nickname === "" || !nickname) {
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
    async postGetItem(@BodyParams("input_data") string_data: string){
        const data: RecieveGetItem = JSON.parse(string_data);
        await this.getItem(data.uuid, data.item_idx, data.count);
    }

    @Post("/get-many-item")
    async postGetManyItems(@BodyParams("input_data") string_data: string){
        const data: RecieveGetItem[] = JSON.parse(string_data);
        for (const d of data) {
            await this.getItem(d.uuid, d.item_idx, d.count);
        }
    }

    @Post("/use-item")
    async postUseItem(@BodyParams("input_data") string_data: string){
        const data: RecieveGetItem = JSON.parse(string_data);
        await this.useItem(data.uuid, data.item_idx, data.count);
    }

    async getItem(uuid: string, idx: number, count: number) {
        const user = await this.userService.findUserIncludeItems(uuid);
        const item = new Item(idx);
        item.count = count;
        user.addItem(item);
        await this.userService.updateUser(user);
    }

    async useItem(uuid: string, idx: number, count: number) {
        const user = await this.userService.findUserIncludeItems(uuid);
        const item = new Item(idx);
        item.count = count;
        const findItem = user.useItem(item);
        await this.userService.updateItem(findItem);
        await this.userService.updateUser(user);
    }
}

export class RecieveGetItem{
    uuid: string;
    item_idx: number;
    count: number;
}