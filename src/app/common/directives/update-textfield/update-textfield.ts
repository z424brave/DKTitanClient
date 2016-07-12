import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'update-textfield',
    template: `<input type="text" class="form-control" [ngClass]="{nofocus: !hasFocus}" (click)="focus()" (focusout)="focusOut()" [(ngModel)]="value.name">`,
    styles: [require('./update-textfield.css')]
})

export class UpdateTextfield {
    @Input() value: any;
    @Output() changeEmitter: EventEmitter<any> =  new EventEmitter();

    hasFocus: boolean;
    origin: string;

    focus() {
        this.hasFocus = true;
        this.origin = this.value.name;
    }

    focusOut() {
        this.hasFocus = false;
        if (this.value.name !== this.origin) {
            if (this.value.name.length === 0) {
                this.value.name = this.origin;
            } else {
                this.changeEmitter.emit(this.value);
            }
        }
    }

}
