import { Inject, Injectable } from "@tsed/di";
import { randomUUID } from "crypto";
import { User } from "../entities/User";
import { Unit } from "../entities/Unit";
import { UserRepository } from "../repositories/UserRepository";
import { Deck } from "../entities/Deck";
import { Exception } from "@tsed/exceptions";
import { ItemRepository } from "../repositories/ItemRepository";
import { Item } from "../entities/Item";
import { StageRepository } from "../repositories/StageRepository";

@Injectable()
export class UserService{

    @Inject()
    protected userRepos: UserRepository;

    @Inject()
    protected itemRepos: ItemRepository;

    @Inject()
    protected stageRepos: StageRepository;

    async testLoginWithNickname(nickname: string) {

        const exist = await this.userRepos.isUserExists(nickname);
        
        if (exist) {
            // login
            let userData = await this.userRepos.findUserByNicknameWithAllRelation(nickname);
            if(!userData) throw new Exception(400, "big issue! no user available!");

            console.log("find existing user");
            userData.energy = userData.getEnergy();
            userData.units.forEach(unit => {
                unit.initSkillLevel();
            });
            userData.stage_result.forEach(stage => {
                stage.initCondition();
            });
            await this.userRepos.saveUser(userData);
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
            userData.updateEnergyTime(new Date());

            userData.addUnit(new Unit(0));
            userData.addUnit(new Unit(1));
            userData.addUnit(new Unit(2));
            userData.addUnit(new Unit(6));
            userData.addUnit(new Unit(12));
            userData.addDeck(new Deck(0));
            
            await this.userRepos.saveUser(userData);
            console.log("create new user");
            return userData;
        }
    }

    async findUserWithUUID(uuid: string) {
        const user = await this.userRepos.findUserByUUID(uuid);
        if (!user) {
            throw Exception;
        }

        return user;
    }

    async findUserIncludeItems(uuid: string){
        const user = await this.userRepos.findUserItems(uuid);
        if (!user) {
            throw new Exception(400, "no user found");
        }

        return user;
    }

    async findUserWithStageResult(uuid: string) {
        const user = await this.userRepos.findUserStageResult(uuid);
        if (!user) {
            throw new Exception(400, "no user found");
        }

        return user;
    }

    async findUserDeck(uuid: string, deck_index: number){
        const decks = (await this.userRepos.findUserDecks(uuid))?.decks;
        if(!decks) throw Exception;

        const deck = decks[deck_index].initUnitId();
        return deck;
    }

    async updateUser(user: User){
        this.userRepos.saveUser(user);
    }
    
    async updateItem(item: Item){
        if (item.count == 0) {
            this.itemRepos.deleteItem(item);
        } else {
            this.itemRepos.updateItem(item);
        }
    }
}