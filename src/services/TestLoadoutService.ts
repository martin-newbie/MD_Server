import { Inject, Injectable } from "@tsed/di";
import { MYSQL_DATASOURCE } from "../datasources/MysqlDatasource";
import { Deck } from "../entities/Deck";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class TestLoadoutService {
    @Inject(MYSQL_DATASOURCE)
    datasource: DataSource;

    protected deckRepos: Repository<Deck>;

    $onInit() {
        this.deckRepos = this.datasource.getRepository(Deck);
    }

    async getDecks(uuid: string) {
        const decks = await this.deckRepos.find({
            where: { user_uuid: uuid },
        });

        if (decks.length === 0) {
            for (let i = 0; i < 4; i++) {
                const deck = new Deck();
                deck.user_uuid = uuid;
                deck.deck_index = i;
                deck.unit_indexes = [-1, -1, -1, -1, -1];
                await this.deckRepos.save(deck);
                decks.push(deck);
            }
        }

        decks.forEach(deck => {
            deck.unit_indexes = [deck.unit1, deck.unit2, deck.unit3, deck.unit4, deck.unit5];
        });

        return decks;
    }

    async updateDeck(deck: Deck) {
        const exists = await this.deckRepos.findOne(
            { where: { id: deck.id} }
        );

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
}