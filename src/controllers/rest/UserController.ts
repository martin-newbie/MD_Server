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
    async postGetItem(@BodyParams("input_data") string_data: string){
        const data: RecieveGetItem = JSON.parse(string_data);

        const user = await this.userService.findUserWithUUID(data.uuid);
        const item = new Item(data.item_idx);
        item.count = data.count;
        user.addItem(item);
        this.userService.updateUser(user);
    }

    @Post("/use-item")
    async postUseItem(@BodyParams("input_data") string_data: string){
        const data: RecieveGetItem = JSON.parse(string_data);
        await this.useItem(data.uuid, data.item_idx, data.count);
    }

    @Post("/test-get-item")
    async testGetItem(@QueryParams("uuid") uuid: string, @QueryParams("item_idx") item_idx: number, @QueryParams("count") count: number){
        this.postGetItem(JSON.stringify({"uuid": uuid, "item_idx": item_idx, "count": count}));
    }

    @Post("/test-use-item")
    async testUseItem(@QueryParams("uuid") uuid: string, @QueryParams("item_idx") item_idx: number, @QueryParams("count") count: number){
        await this.useItem(uuid, item_idx, count);
    }

    async useItem(uuid: string, idx: number, count: number) {
        
        const user = await this.userService.findUserIncludeItems(uuid);
        const item = new Item(idx);
        item.count = count;
        const findItem = user.useItem(item);

        if(findItem.count === 0){
            this.userService.deleteItem(findItem);
        }else{
            this.userService.updateItem(findItem);
        }

        this.userService.updateUser(user);
    }
}

export class RecieveGetItem{
    uuid: string;
    item_idx: number;
    count: number;
}