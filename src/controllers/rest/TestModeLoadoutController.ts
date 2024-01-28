import { Controller, Inject } from "@tsed/di";
import { BodyParams, QueryParams } from "@tsed/platform-params";
import { Get, Post, Put, string } from "@tsed/schema";
import { TestDeck } from "../../entities/TestDeck";
import { TestLoadoutService } from "../../services/TestLoadoutService";

@Controller("/test-loadout")
export class TestModeLoadoutController {
    @Inject()
    protected loadoutService: TestLoadoutService;

    @Post("/deck-enter")
    async testDeck(@BodyParams("input_data") uuid: string) {
        const decks = await this.loadoutService.getTestDecks(uuid);
        return {
            "decks": decks,
        }
    }

    @Post("/deck-save")
    async updateDeckAt(@BodyParams("input_data") input_data: string) {
        const deck: TestDeck = JSON.parse(input_data);
        await this.loadoutService.updateTestDeck(deck);

        return null;
    }
}