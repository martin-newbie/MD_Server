import { Controller, Inject } from "@tsed/di";
import { BodyParams, QueryParams } from "@tsed/platform-params";
import { Get, Post, Put, string } from "@tsed/schema";
import { Deck } from "../../entities/Deck";
import { LoadoutService } from "../../services/LoadoutService";

@Controller("/loadout")
export class LoadoutController {
    @Inject()
    protected loadoutService: LoadoutService;

    @Post("/deck-enter")
    async deck(@BodyParams("input_data") uuid: string) {
        const decks = await this.loadoutService.getDecks(uuid);
        return {
            "decks": decks,
        }
    }

    @Post("/deck-save")
    async updateDeckAt(@BodyParams("input_data") input_data: string) {
        const deck: Deck = JSON.parse(input_data);
        await this.loadoutService.updateDeck(deck);

        return null;
    }

    @Post("/deck-add")
    async addDeck(@BodyParams("input_data") uuid: string){
        const deck = await this.loadoutService.addDeck(uuid);
        console.log(deck);
        return { "deck": deck };
    }

    @Post("/deck-save-all")
    async deckSaveAll(@BodyParams("input_data") input_data: string) {
        await this.loadoutService.saveAllDeck(input_data);
        return null;
    }
}