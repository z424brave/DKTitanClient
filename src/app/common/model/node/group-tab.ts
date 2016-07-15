/**
 * Created by Damian.Kelly on 15/07/2016.
 */

import {GroupNode} from "./group-node";

export class GroupTab {

    title: string;

    constructor(public groupNode: GroupNode,
                public active: boolean,
                public isLast: boolean) {

        this.title = groupNode.name;

    }
}