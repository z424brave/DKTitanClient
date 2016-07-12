/**
 * Created by Damian.Kelly on 01/07/2016.
 */
import {BaseEntity} from '../../base-entity';
import {User} from '../user/user';

export class ApplicationType extends BaseEntity {

    name: string;
    user: User;
    tags: string[] = [];
    status: string;

    constructor() {
        super();
    }

}
