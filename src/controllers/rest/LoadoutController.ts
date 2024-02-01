import { Controller, Inject } from "@tsed/di";
import { BodyParams, QueryParams } from "@tsed/platform-params";
import { Get, Post, Put, string } from "@tsed/schema";
import { Deck } from "../../entities/Deck";
import { LoadoutService } from "../../services/LoadoutService";

@Controller("/test-loadout")
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
}