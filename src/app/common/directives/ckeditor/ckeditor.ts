import {Component, ElementRef, Input, OnInit, AfterViewInit} from '@angular/core';

declare var CKEDITOR: any;

@Component({
    selector: 'textarea',
    template: ''
})
export class Ckeditor implements OnInit, AfterViewInit {

    @Input() initialContent: string;
	instance: any;
    constructor(_elm: ElementRef) {
        this.instance = CKEDITOR.replace(_elm.nativeElement);
    }
    ngOnInit() {

	    console.log(`in ckeditor / ngOnInit`);	
		console.log(`in ngOnInit in ckeditor - content is ${this.initialContent}`);
		this.instance.setData(this.initialContent);		
	}

    ngAfterViewInit() {

	    console.log(`in ckeditor / ngAfterViewInit`);	
		console.log(`in ckeditor / ngAfterViewInit - content is ${this.initialContent}`);
		this.instance.setData(this.initialContent);		
	}	

    ngAfterViewChecked() {
		console.log(`in ngAfterViewChecked in ckeditor - content is ${this.initialContent}`);	
	}
	
	initialContentChange() {
		console.log(`in ckeditor / initialContentChange - content is ${this.initialContent}`);	
	}
}
