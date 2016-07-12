import {Pipe} from '@angular/core';
import {UpdateFromSelectValue} from './model/update-from-select-value';
// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
    name: 'SelectedValuePipe'
})
export class SelectedValuePipe {

    transform(value, selected: boolean) {
        return value.filter((availableValue: UpdateFromSelectValue) => {
            return availableValue.selected === selected;
        });
    }
}
