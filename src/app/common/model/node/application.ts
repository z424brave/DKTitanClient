/**
 * Created by Damian.Kelly on 01/07/2016.
 */
import {BaseEntity} from '../../base-entity';
import {User} from '../user/user';
import {ContentNode} from "./content-node";
import {ApplicationType} from "./application-type";
import {TagValue} from "../lexicon/tag-value";
import {GroupNode} from "./group-node";

export class Application extends BaseEntity {

    name: string;
    user: User;
    tags: TagValue[] = [];
    applicationType: ApplicationType;
    status: string;
    publishable: boolean;
    nodes: ContentNode[];
    applicationGroups: GroupNode[];

    
    constructor() {
        super();
        this.applicationType = new ApplicationType();
        this.applicationType.name = 'defaultAppType';
    }

}
