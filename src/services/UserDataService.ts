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
            const userData = await this.userDataRepository.findUserByNickname(nickname);
            console.log("find existing user : \n" + userData);
            return userData;
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
            console.log("create new user : \n" + userData);
            return userData;
        }
    }

    testLoginWithUUID(){

    }
}