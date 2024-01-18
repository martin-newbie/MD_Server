import { Inject, Injectable } from "@tsed/di";
import { randomUUID } from "crypto";
import { User } from "../entities/User";
import { Unit } from "../entities/Unit";
import { UserRepository } from "../repositories/UserRepository";
import { UnitRepository } from "../repositories/UnitRepository";
import { DataSource, Repository } from "typeorm";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";

@Injectable()
export class UserService{

    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    @Inject()
    protected userRepository: UserRepository;

    protected unitRepository: UnitRepository;

    $onInit(){
        this.unitRepository = this.datasource.getRepository(Unit);
    }

    async testLoginWithNickname(nickname: string){
        if(nickname === null){
            return {
                "code": 400, 
                "message": "nickname is required"
            };
        }

        const exist = await this.userRepository.isUserNicknameExist(nickname);
        if (exist) {
            // login
            const userData = await this.userRepository.findUserByNickname(nickname);
            console.log("find existing user : \n" + userData);
            return userData;
        } else {
            // create new
            const userData = new User();
            userData.userNickname = nickname;
            userData.uuid = randomUUID();
            userData.userCoin = 100000;
            userData.userDia = 1200;
            userData.userLevel = 0;
            userData.userExp = 0;

            userData.addUnit(new Unit(2));
            userData.addUnit(new Unit(1));
            userData.addUnit(new Unit(5));
            userData.addUnit(new Unit(12));
            userData.addUnit(new Unit(6));
            
            await this.userRepository.addNewUser(userData);

            console.log("create new user : \n" + userData);
            return userData;
        }
    }
}