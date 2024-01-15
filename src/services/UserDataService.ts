import { Inject, Injectable } from "@tsed/di";
import { randomUUID } from "crypto";
import { UserDataModel } from "../models/UserDataModel";
import { UserDataRepository } from "../repositories/UserDataRepository";

@Injectable()
export class UserDataService{
    @Inject()
    protected userDataRepository: UserDataRepository;

    async testLoginWithNickname(nickname: string){
        if(nickname === null){
            return {
                "code": 400, 
                "message": "nickname is required"
            };
        }

        const exist = await this.userDataRepository.isUserNicknameExist(nickname);
        if (exist) {
            // login
            return this.userDataRepository.findUserByNickname(nickname);
        }else{
            // create new
            const userData = new UserDataModel();
            userData.userNickname = nickname;
            userData.uuid = randomUUID();
            userData.userCoin = 100000;
            userData.userDia = 1200;
            userData.userLevel = 0;
            userData.userExp = 0;
            this.userDataRepository.addNewUser(userData);
            return userData;
        }
    }

    testLoginWithUUID(){

    }
}