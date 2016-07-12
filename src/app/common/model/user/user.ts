import {BaseEntity} from '../../base-entity';

export class User extends BaseEntity {

    name: string;
    email: string;
    password: string;
    roles: string[];
    status: string;
    lastLogin: string;

    constructor() {
        super();
    }

}