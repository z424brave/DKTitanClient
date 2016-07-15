/**
 * Created by Damian.Kelly on 15/07/2016.
 */
import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {ContentNode} from "../../../common/model/node/content-node";
import {VersionSort} from "../../../common/version-sort-pipe";
import {InlineEditor} from "../../../common/directives/inline-editor/inline-editor";

@Component({
    template: require('./content-text.html'),
    styles: [require('./content-text.css'), require('../../../app.css')],
    pipes: [VersionSort],
    directives: [InlineEditor],
    selector:'content-text'
})

export class ContentText implements OnInit, OnDestroy {

    @Input() contentNode: ContentNode ;
    displayVersion: number = 0;
    displayVersionNumber: number = 1;
    displayVersionMessage: string = "";
    isCurrentVersion: boolean = true;
    saveAction: string;
    isNewNode: boolean = false;
    types: string[] = ['text','html'];
    editorContent: string;
    updatedEditorContent: string;

    constructor() {

    }

    ngOnInit() {
        console.log(`In OnInit - ContentText : ${this.contentNode.name}`);
        console.log(`In OnInit - ContentText : ${this.contentNode.content[0].media[0].content}`);
        this.displayVersion = this.contentNode.content.length - 1 ;
        this.displayVersionMessage = this.contentNode.content[this.displayVersion].versionMessage;
        this.displayVersionNumber = this.contentNode.content[this.displayVersion].versionNo;
        this.isCurrentVersion = (this.displayVersion === this.contentNode.content.length - 1) ? true : false;
        this.saveAction = this.isNewNode ? 'Save' : 'Update';
        this.editorContent = this.contentNode.content[this.displayVersion].media[0].content;
        this.updatedEditorContent = this.editorContent;
        console.log(`In OnInit - ContentText : ${this.isCurrentVersion} : ${this.displayVersion} : ${this.contentNode.content.length}`);
    }

    ngOnDestroy() {
        console.log(`In OnDestroy - ContentText`);
    }

    changeVersion(content) {
        console.log(`In changeVersion - ContentText ${content.versionNo} : ${content.versionMessage}`);
        this.displayVersion = content.versionNo - 1 ;
        this.displayVersionMessage = this.contentNode.content[this.displayVersion].versionMessage;
        this.displayVersionNumber = this.contentNode.content[this.displayVersion].versionNo;
        this.isCurrentVersion = (this.displayVersion === this.contentNode.content.length - 1) ? true : false;
        this.editorContent = content.media[0].content;
        this.updatedEditorContent = this.editorContent;
    }

    onSubmit($event) {
        console.log(`In OnSubmit - ContentText : ${$event}`);
        $event.preventDefault();
        this.contentNode.content[this.displayVersion].media[0].content = this.updatedEditorContent;
        this.editorContent = this.contentNode.content[this.displayVersion].media[0].content;
    }

    cancel($event) {
        console.log(`In cancel - ContentText : ${$event}`);
        $event.preventDefault();
        this.editorContent = this.contentNode.content[this.displayVersion].media[0].content;
        this.updatedEditorContent = this.editorContent;
    }

    onTypeChanged(type) {
        console.log(`In onTypeChanged - ContentText : ${type}`);
        this.contentNode.type = type;
        this.updatedEditorContent = this.editorContent;
    }

    editorContentChanged($event) {
        console.log(`In editorContentChanged - ContentText : ${$event.target.value}`);
        this.updatedEditorContent = $event.target.value;
    }

}
