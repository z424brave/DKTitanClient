/**
 * Created by Damian.Kelly on 15/07/2016.
 */

import {ContentNode} from "./content-node";

export class NodeTab {

    title: string;

    constructor(public contentNode: ContentNode,
                public active: boolean,
                public isLast: boolean) {

        this.title = contentNode.name;

    }
}
