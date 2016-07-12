import {BaseEntity} from '../../base-entity';

export class Channel extends BaseEntity {

    name: string;
    driver: string;

    constructor() {
        super();
    }

}
