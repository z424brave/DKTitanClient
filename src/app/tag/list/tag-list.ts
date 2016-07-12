/**
 * Created by Damian.Kelly on 23/06/2016.
 */
import {Component, OnInit} from '@angular/core';
import {Router, CanActivate, ComponentInstruction} from '@angular/router-deprecated';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from '@angular/common';

import {Tag} from '../../common/model/lexicon/tag';
import {TagService} from '../../common/service/tag-service';

import {authCheck} from '../../auth/auth-check';
import {MainMenu} from '../../menu/menu-component';
import {UpdateTextfield} from '../../common/directives/update-textfield/update-textfield';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination';
import {IsoDatePipe} from "../../common/iso-date-pipe";

let _ = require('lodash');

@Component({
    template: require('./tag-list.html'),
    styles: [require('./tag-list.css'), require('../../app.css')],
    providers: [TagService, PaginationService],
    directives: [UpdateTextfield, MainMenu, CORE_DIRECTIVES, FORM_DIRECTIVES,PaginationControlsCmp],
    pipes: [PaginatePipe, IsoDatePipe]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class TagList implements OnInit {

    tags: Tag[];

    newTag: Tag;

    constructor(private _tagService: TagService,
                private _router: Router) {

    }

    ngOnInit() {
        this.init();

    }

    init() {
        console.log(`In init in Tag`);
        this._tagService.getTags()
            .subscribe(
                data => this.tags = data
            );

        this.newTag = new Tag();
    }

    createTag() {
        console.log(`In Tag - createTag`);
        this._router.navigate(['TagDetail', {id: undefined}]);
    }

    onSelectTag(tag) {
        console.log(`In Tag - onSelectTag`);
        this._router.navigate(['TagDetail', {id: tag._id}]);
    }

    deleteTag(tagId: string) {
        console.log(`In Tag - deleteTag - ${tagId}`);
        this._tagService.deleteTag(tagId)
            .subscribe(() => {
                    this.init();
                }
            );
    }

}
