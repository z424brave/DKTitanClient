/**
 * Created by Damian.Kelly on 16/06/2016.
 */
import { Component, Input } from '@angular/core';
import {Router} from "@angular/router-deprecated";
import {ContentNode} from "../../../common/model/node/content-node";
import {ContentService} from "../../../common/service/content-service";

@Component({
    selector: 'content-publish',
    template: require('./content-publish.html'),
    providers: [ContentService],
    styles: [require('./content-publish.css')]
})
export class ContentPublish {

    @Input() node: ContentNode;
    private publishMsg: string;
    public publishIsVisible: boolean;
    public selectedChannel: string;
    public publishFileName: string;
    private channels: Array<string> = ['Twitter','Launcher']

    constructor(private _contentService: ContentService,
                private _router: Router) {
    }

    showPublish(msg: string)
    {
        this.publishMsg = msg;
        this.publishIsVisible = true;
    }

    hidePublish()
    {
        this.publishIsVisible = false;
    }

    publish()
    {
        console.log(`publishing ...${this.publishFileName}`);
        this._contentService.publishNode(this.node,this.publishFileName)
            .subscribe(node => {
                console.log(`before server ${JSON.stringify(this.node)}`);
                this.publishIsVisible = false;
                this._router.navigate(['ContentDetail', {id: this.node._id}]);
            });

    }

    onSelectedChannelChanged($event) {
        console.log(`onSelectedChannelChanged ${$event}`);
        this.selectedChannel = $event;

    }

}
