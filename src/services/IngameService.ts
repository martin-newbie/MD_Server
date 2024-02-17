import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { Deck } from "../entities/Deck";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class InGameService{
    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    protected deckRepos: Repository<Deck>;

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
}