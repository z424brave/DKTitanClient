import {Component, Input, OnInit, Injectable} from '@angular/core';
import {UpdateFromSelectValue} from '../../model/update-from-select-value';
import {SelectedValuePipe} from '../../selected-value-pipe';

@Component({
    selector: 'update-from-select',
    template: require('./update-from-select.html'),
    pipes: [SelectedValuePipe],
    styles: [require('./update-from-select.css')]
})

@Injectable()
export class UpdateFromSelect implements OnInit {

    @Input() allValues: Array<UpdateFromSelectValue>;

	constructor() {

    }
	
    select(value) {

        this.updateValueInArray(value);
	    console.log(`in select for ${value.name} - Values are : ${JSON.stringify(this.allValues)}`);

    }

    deSelect(value) {

        this.updateValueInArray(value);
        console.log(`in deSelect for ${value.name} - Values are : ${JSON.stringify(this.allValues)}`);

    }

    updateValueInArray(value) {

        this.allValues = this.allValues.map((v) => {
            if (v === value) {
                v.toggleSelected();
            }
            return v;
        });

    }

    ngOnInit() {

        console.log(`in ngOninit - Values are : ${JSON.stringify(this.allValues)}`);

    }

}
