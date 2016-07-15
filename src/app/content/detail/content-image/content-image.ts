/**
 * Created by Damian.Kelly on 15/07/2016.
 */
import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {ContentNode} from "../../../common/model/node/content-node";
import {ImageBox} from "../../../common/directives/image-box/image-box";

@Component({
    template: require('./content-image.html'),
    styles: [require('./content-image.css')],
    directives: [ImageBox,],
    selector:'content-image'
})

export class ContentImage implements OnInit, OnDestroy{

    @Input() contentNode: ContentNode ;
    displayVersion: number = 0;

    constructor(){

    }

    ngOnInit(){
        console.log(`In OnInit - ContentImage : ${this.contentNode.name}`);
        console.log(`In OnInit - ContentImage : ${this.contentNode.content[0].media[0].content}`);
        this.displayVersion = this.contentNode.content.length - 1 ;
    }

    ngOnDestroy(){
        console.log(`In OnDestroy - ContentImage`);
    }

    changeVersion(content) {
        console.log(`In changeVersion - ContentText ${content.versionNo} : ${content.versionMessage}`);
        this.displayVersion = content.versionNo - 1 ;
    }
}
