import {Pipe, PipeTransform} from '@angular/core';
import {Content} from './model/node/content';

let _ = require('lodash');

@Pipe({name: 'versionSort'})

export class VersionSort implements PipeTransform {
    transform(contentNodes: Array<Content>): Array<Content> {
        return _.sortBy(contentNodes, (content) => {
            return -content.versionNo;
        });
    }
}
