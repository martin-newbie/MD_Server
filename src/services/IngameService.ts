import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { Deck } from "../entities/Deck";
import { DataSource, Repository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { StagePerfaction } from "../entities/StagePerfaction";
import { Unit } from "../entities/Unit";
import { Exception } from "@tsed/exceptions";
import { User } from "../entities/User";

@Injectable()
export class InGameService{
    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    protected deckRepos: Repository<Deck>;
    protected unitRepos: Repository<Unit>;

    @Inject()
    protected userRepository: UserRepository;

    $onInit(){
        this.deckRepos = this.datasource.getRepository(Deck);
        this.unitRepos = this.datasource.getRepository(Unit);
    }

    async getGameDeck(uuid: string, idx: number){
        const decks = await this.deckRepos.find({
            where: {user_uuid: uuid},
        });
        
        const deck = decks.find(item => item.deck_index === idx);
        if(deck === undefined) {
            throw {
                "is_error": true,
                "error_message": "Deck not found.",
            }
        }

        deck.unit_indexes = [deck.unit1, deck.unit2, deck.unit3, deck.unit4, deck.unit5];
        return deck;
    }

    async getUser(uuid: string) {
        const user = await this.userRepository.findUserByUUID(uuid);
        if(user === null) {
            throw {
                "is_error": true,
                "error_message": "User not found.",
            }
        }
        return user;
    }

    async saveUser(user: User) {
        await this.userRepository.saveUser(user);
    }

    async saveUnit(unit: Unit) {
        await this.unitRepos.save(unit);
    }

    async getUnit(id: number){
        const unit = await this.unitRepos.findOne({where: {id: id}});
        if(unit === null) {
            throw {
                "is_error": true,
                "error_message": "Unit not found.",
            }
        }
        return unit;
    }

    async updateStagePerfaction(uuid: string, stage_index: number, chapter_index: number, perfaction: boolean[]) {
        const user = await this.userRepository.findUserByUUID(uuid);
        if(user === null) {
            return;
        }

        let stagePerfaction = user.stage_perfactions.find(item => item.stage_idx === stage_index && item.chapter_idx === chapter_index);
        if(stagePerfaction === undefined || stagePerfaction === null) {
            stagePerfaction = new StagePerfaction();
            stagePerfaction.stage_idx = stage_index;
            stagePerfaction.chapter_idx = chapter_index;
            user.stage_perfactions.push(stagePerfaction);
        }
        
        stagePerfaction.condition_1 = perfaction[0];
        stagePerfaction.condition_2 = perfaction[1];
        stagePerfaction.condition_3 = perfaction[2];
    }
}