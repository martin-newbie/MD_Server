import { Repository } from "typeorm";
import { Unit } from "../entities/Unit";
import { Injectable } from "@tsed/di";

@Injectable()
export class UnitRepository  extends Repository<Unit>{
    
}