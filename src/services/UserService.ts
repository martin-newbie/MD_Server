import { Inject, Injectable } from "@tsed/di";
import { randomUUID } from "crypto";
import { User } from "../entities/User";
import { Unit } from "../entities/Unit";
import { UserRepository } from "../repositories/UserRepository";
import { UnitRepository } from "../repositories/UnitRepository";
import { DataSource } from "typeorm";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { Deck } from "../entities/Deck";
import { Exception } from "@tsed/exceptions";

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
            console.log("find existing user");
            userData?.units.forEach(unit => {
                unit.skill_level = [unit.skill_level_0, unit.skill_level_1, unit.skill_level_2, unit.skill_level_3];
            });
            return userData;
        } else {
            // create new
            const userData = new User();
            userData.nickname = nickname;
            userData.uuid = randomUUID();
            userData.coin = 100000;
            userData.dia = 1200;
            userData.level = 0;
            userData.exp = 0;
            userData.energy = 100;
            userData.last_energy_updated = new Date();

            userData.addUnit(new Unit(0));
            userData.addUnit(new Unit(1));
            userData.addUnit(new Unit(2));
            userData.addUnit(new Unit(6));
            userData.addUnit(new Unit(12));
            userData.addDeck(new Deck(0));
            
            await this.userRepository.saveUser(userData);
            console.log("create new user");
            return userData;
        }
    }

    async findUserWithUUID(uuid: string) {
        const user = await this.userRepository.findUserByUUID(uuid);
        if (user == null || user == undefined) {
            throw Exception;
        }

        return user;
    }
}