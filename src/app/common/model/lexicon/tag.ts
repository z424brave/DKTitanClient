import {BaseEntity} from '../../base-entity';
export class Tag extends BaseEntity {

    name: string;
    description: string;
    status: string;
    requiresValue: boolean;

    constructor() {
        super();
    }

}
