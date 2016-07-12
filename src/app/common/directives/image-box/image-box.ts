/**
 * Created by Damian.Kelly on 13/06/2016.
 */
import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {EXTERNAL_URL_PREFIX} from '../../../config';

@Component({
    template: require('./image-box.html'),
    styles: [require('./image-box.css')],
    selector:'image-box'
})

export class ImageBox implements OnInit, OnDestroy{

    imageFilePath: string = EXTERNAL_URL_PREFIX;
    @Input() imageFileName: string ;

    constructor(){

    }

    ngOnInit(){
        console.log(`In OnInit - ImageBox : ${this.imageFilePath} / ${this.imageFileName}`);
    }

    ngOnDestroy(){
        console.log(`In OnDestroy - ImageBox :`);
    }

}
