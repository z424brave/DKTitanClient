/**
 * Created by Damian.Kelly on 29/06/2016.
 */
import { Component, Input } from '@angular/core';
import {Router} from "@angular/router-deprecated";
import {ContentNode} from "../../../common/model/node/content-node";
import {ContentService} from "../../../common/service/content-service";

@Component({
    selector: 'content-editjson',
    template: require('./content-editjson.html'),
    providers: [ContentService],
    styles: [require('./content-editjson.css')]
})

export class ContentEditjson {

    @Input() node: ContentNode;
    public editjsonIsVisible: boolean;
    public jsonNode: string;
    public jsonObj: any;

    constructor(private _contentService: ContentService,
                private _router: Router) {
    }

    showEditjson()
    {
        this.editjsonIsVisible = true;
        this.jsonNode = this.node.content[this.node.content.length - 1].media[0].content;
        console.log(`node content is ${this.jsonNode}`);
        this.jsonObj = JSON.parse(this.jsonNode);
        console.log(`node content is ${JSON.stringify(this.jsonObj)}`);
    }

    hideEditjson()
    {
        this.editjsonIsVisible = false;
    }

    commit()
    {
        this.node.content[this.node.content.length - 1].media[0].content = JSON.stringify(this.jsonObj);
        this.node.content
        this._contentService.updateNode(this.node)
            .subscribe(node => {
                console.log(`before server ${JSON.stringify(this.node)}`);
                this._router.navigate(['ContentDetail', {id: this.node._id}]);
                this.editjsonIsVisible = false;
            });
    }
}
