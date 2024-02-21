import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { Deck } from "../entities/Deck";
import { DataSource, Repository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { StagePerfaction } from "../entities/StagePerfaction";

@Injectable()
export class InGameService{
    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    protected deckRepos: Repository<Deck>;

    @Inject()
    protected userRepository: UserRepository;

    $onInit(){
        this.deckRepos = this.datasource.getRepository(Deck);
    }

    async getGameDeck(uuid: string, idx: number){
        const decks = await this.deckRepos.find({
            where: {user_uuid: uuid},
        });
        
        const deck = decks.find(item => item.deck_index === idx) as Deck;
        deck.unit_indexes = [deck.unit1, deck.unit2, deck.unit3, deck.unit4, deck.unit5];
        return deck;
    }

    async getUser(uuid: string) {
        return await this.userRepository.findUserByUUID(uuid);
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