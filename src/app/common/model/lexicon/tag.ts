import {BaseEntity} from '../../base-entity';
import {Lexicon} from "./lexicon";
export class Tag extends BaseEntity {

    name: string;
    description: string;
    status: string = 'active';
    requiresValue: boolean = false;
    lexicon: Lexicon;

    constructor() {
        super();
    }

}
