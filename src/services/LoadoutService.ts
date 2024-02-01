import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { Deck } from "../entities/Deck";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/User";
import { Exception } from "@tsed/exceptions";

@Injectable()
export class LoadoutService {
    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    protected deckRepos: Repository<Deck>;
    protected userRepos: Repository<User>;

    $onInit() {
        this.deckRepos = this.datasource.getRepository(Deck);
        this.userRepos = this.datasource.getRepository(User);
    }

    async getDecks(uuid: string) {
        let user = await this.userRepos.findOne({ 
            where: { uuid: uuid },  
            relations: ['decks']
        });
        if(user == null){
            return;
        }

        let decks = user.decks;
        decks.forEach(deck => {
            deck.unit_indexes = [deck.unit1, deck.unit2, deck.unit3, deck.unit4, deck.unit5];
        });

        return decks;
    }

    async updateDeck(deck: Deck) {
        const exists = await this.deckRepos.findOne({ where: { id: deck.id } });

        if (exists) {
            await this.deckRepos.update(
                { id: deck.id },
                {
                    unit1: deck.unit1,
                    unit2: deck.unit2,
                    unit3: deck.unit3,
                    unit4: deck.unit4,
                    unit5: deck.unit5,
                }
            );
        } else {
            await this.deckRepos.save(deck);
        }
    }

    async addDeck(uuid: string){
        const user = await this.userRepos.findOne({
            where: {uuid: uuid},
            relations: ['decks']
        });

        if(user == null){
            return;
        }

        const deck_index = user.decks.length;
        user.addDeck(new Deck(deck_index));
        await this.userRepos.save(user);
        return user.decks[deck_index];
    }
}