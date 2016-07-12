import {Pipe, PipeTransform} from '@angular/core';

let dateformat = require('dateformat');

@Pipe({name: 'isoDate'})
export class IsoDatePipe implements PipeTransform {
    transform(value: string, ...args:string[]): any {
        console.log(`IsoDatePipe : ${value} : ${args} : ${dateformat(Date.parse(value), args)}`);
        return value ? dateformat(Date.parse(value), args) : "-";
    }
}