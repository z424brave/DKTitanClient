import {BaseEntity} from '../../base-entity';
import {Content} from './content';
import {User} from '../user/user';
import {TagValue} from "../lexicon/tag-value";

export class ContentNode extends BaseEntity {

    name: string;
    user: User;
    tags: TagValue[] = [];
    content: Content[] = [];
    type: string;
    status: string;

    constructor() {
        super();
    }

}
