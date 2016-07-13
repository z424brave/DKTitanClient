import {BaseEntity} from '../../base-entity';
import {Tag} from './tag';

export class Lexicon extends BaseEntity {

    name: string;
    description: string;
    status: string;
    // tags: [Tag];
    constructor() {
        super();
    }

}
