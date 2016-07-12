import {Component, ElementRef, Input, Output, AfterViewInit, OnInit, ViewChild, EventEmitter, Renderer} from '@angular/core';
import {NgControl} from '@angular/common';

declare var CKEDITOR: any;

@Component({
    selector: 'inline-editor',
    template: `<textarea #myEditArea (change)="onValueChange($event)"></textarea>`
})
export class InlineEditor implements OnInit, AfterViewInit {

    @Input() config: any;
    @Input() ngModel: any;

    @Output() change: EventEmitter<any> = new EventEmitter();
	@ViewChild('myEditArea') editArea: ElementRef; 
	
    value: any = '';
    ngControl: NgControl;
	instance: any;
	_elm: ElementRef;
    renderer: Renderer ;	
	
    constructor(_elm: ElementRef, ngControl:NgControl, renderer: Renderer) {
	
		this._elm = _elm;
        if( ngControl ){
            ngControl.valueAccessor = this;
            this.ngControl = ngControl;
        }	
		this.renderer = renderer;
		
    }
    /**
     * On component init
     */
    ngOnInit() : void {

		console.log(`inline-editor / ngOnInit`);

    }	
    /**
     * On component destroy
     */
    ngOnDestroy() : void {

		console.log(`inline-editor / ngOnDestroy`);
		
        if( this.instance ) {
            this.instance.removeAllListeners();
			console.log(`inline-editor / ngOnDestroy - destroying editor instance`);			
            this.instance.destroy();
            this.instance = null;
        }
		
    }
    /**
     * On component view init
     */
    ngAfterViewInit() : void {

		console.log(`inline-editor / ngAfterViewInit - ${this.editArea.nativeElement.value}`);

        // Configuration
        let config = {};

        config = this.config || {};
        this.ckeditorInit( config );
		
    }
    /**
     * Detect textarea value change
     */
    onValueChange(event: any) {

		console.log(`inline-editor / onValueChange`);	
        var value = this._elm.nativeElement.value;
        this.change.emit( value );
        this.ngControl.viewToModelUpdate( value );
		
    }
    /**
     * CKEditor init
     */
    ckeditorInit( config: any ) {

        if(!CKEDITOR){
            console.error('Please include CKEditor in your page');
            return;
        }
		console.log(`editor init - ${this._elm}`);
        // CKEditor replace textarea
        this.instance = CKEDITOR.replace( this._elm.nativeElement, config );
//        this.instance = CKEDITOR.inline( this.editArea.nativeElement, config );		

        // Set initial value
        this.instance.setData(this.value);

        // CKEditor change event
        this.instance.on('change', () => {
			console.log(`change event - ${this.instance.getData()}`);
            this.renderer.setElementProperty(this._elm.nativeElement, 'value', this.instance.getData());
            this.renderer.invokeElementMethod(this._elm.nativeElement, 'dispatchEvent', [new Event('change')]);
        });
    }
    /**
     * Implements ControlValueAccessor
     */
    writeValue(value){

		console.log(`inline-editor / writeValue - ${value}`);	    
		this.value = value;
        if( this.instance )
            this.instance.setData(value);
    
	}
	
    onChange(event) {

		console.log(`inline-editor / onChange ${JSON.stringify(event)}`);
		
	}
    
	onTouched(){

		console.log(`inline-editor / onTouched`);
		
	}
    
	registerOnChange(fn){
		this.onChange = fn;
	}
    registerOnTouched(fn){
		this.onTouched = fn;
	}
	
}
