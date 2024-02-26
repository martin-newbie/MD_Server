import { Injectable } from "@tsed/di";
import { Deck } from "../entities/Deck";
import { Repository } from "typeorm";


@Injectable()
export class DeckRepository extends Repository<Deck>{
    
}