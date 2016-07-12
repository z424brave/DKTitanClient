import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, AfterViewChecked} from '@angular/core';
import {ContentTab} from './../tab/content-tab';
import {Ckeditor} from '../../common/directives/ckeditor/ckeditor';

declare var CKEDITOR: any;

@Component({
    selector: 'content-editor',
    template: require('./content-editor.html'),
    styles: [require('./content-editor.css')]

})

export class ContentEditor implements OnInit, OnDestroy, AfterViewChecked {

    @Input() editorContent: string;
	@Input() activeTab: ContentTab;
    @Input() isLast: boolean;
    @Input() active: boolean;	
    @Input() language: any;	
    @Output() editorContentChange: EventEmitter<any>;
	editorInstance: any;

    constructor(_elm: ElementRef) {
        this.editorInstance = CKEDITOR.replace(_elm.nativeElement);
		this.editorContentChange = new EventEmitter();
    }

    ngOnInit() {
	
		console.log(`in ngOnInit in content-editor - content is ${this.editorContent}`);
		
    }
	
    ngAfterViewChecked() {
	
		console.log(`in ngAfterViewChecked in content-editor - content is ${this.editorContent}`);	
		this.editorInstance.setData(this.editorContent);		
	}
	
	public ngOnDestroy():void {

		console.log(`in ngOnDestroy in editor`);

	}

}