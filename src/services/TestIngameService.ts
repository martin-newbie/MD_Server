import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { TestDeck } from "../entities/TestDeck";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class TestIngameService{
    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    protected testDeckRepos: Repository<TestDeck>;

    $onInit(){
        this.testDeckRepos = this.datasource.getRepository(TestDeck);
    }

    async getGameDeck(uuid: string, idx: number){
        const decks = await this.testDeckRepos.find({
            where: {user_uuid: uuid},
        });
        
        const deck = decks.find(item => item.deck_index === idx) as TestDeck;
        deck.unit_indexes = [deck.unit1, deck.unit2, deck.unit3, deck.unit4, deck.unit5];
        return deck;
    }
}