/**
 * Created by Damian.Kelly on 15/07/2016.
 */
import {BaseEntity} from '../../base-entity';
import {TagValue} from "../lexicon/tag-value";
import {Application} from "./application";

export class GroupNode extends BaseEntity {

    name: string;
    tags: TagValue[] = [];
    applications: Application[] = [];

    constructor() {
        super();
    }

}
