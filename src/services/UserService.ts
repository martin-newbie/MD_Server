import { Inject, Injectable } from "@tsed/di";
import { randomUUID } from "crypto";
import { User } from "../entities/User";
import { Unit } from "../entities/Unit";
import { UserRepository } from "../repositories/UserRepository";
import { Deck } from "../entities/Deck";
import { Exception } from "@tsed/exceptions";
import { ItemRepository } from "../repositories/ItemRepository";
import { Item } from "../entities/Item";
import { Reward } from "./IngameService";

@Injectable()
export class UserService{

    @Inject()
    protected userRepos: UserRepository;

    @Inject()
    protected itemRepos: ItemRepository;

    async testLoginWithNickname(nickname: string) {

        const exist = await this.userRepos.isUserExists(nickname);
        
        if (exist) {
            // login
            let userData = await this.userRepos.findUserByNicknameWithAllRelation(nickname);
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

    async applyReward(user: User, reward: Reward[]) {

        reward.forEach(async reward => {
            switch(reward.type){
                case 0:
                    const item = new Item(reward.index);
                    item.count = reward.count;
                    user.addItem(item);
                    break;
                case 1:
                    user.updateCurrency(reward.index, reward.count);
                    break;
                case 2:
                    const units = (await this.userRepos.findUserUnits(user.uuid))?.units;
                    if(!units) throw Exception;

                    if (!units.some(unit => unit.index === reward.index)) {
                        user.addUnit(new Unit(reward.index));
                    } else {
                        // TODO : add duplicated unit item
                    }
                    break;
            }
        });

        await this.userRepos.saveUser(user);
    }
}