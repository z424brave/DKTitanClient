import {BaseEntity} from '../../base-entity';

export class SearchNode extends BaseEntity {

    user: string;
    tags: string[] = [];
    type: string;
    status: string;
    contains: string;
    lexicon: string;
    applicationType: string;
	
    constructor() {
        super();
    }

}
