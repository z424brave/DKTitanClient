/**
 * Created by Damian.Kelly on 24/06/2016.
 */
import {Component, OnInit} from '@angular/core';
import {Router, RouteParams, CanActivate, ComponentInstruction} from '@angular/router-deprecated';
import {FORM_DIRECTIVES, CORE_DIRECTIVES,
    FormBuilder,
    Validators,
    AbstractControl,
    ControlGroup} from '@angular/common';

import {Lexicon} from './../../common/model/lexicon/lexicon';
import {Tag} from '../../common/model/lexicon/tag';

import {LexiconService} from './../../common/service/lexicon-service';
import {TagService} from './../../common/service/tag-service';
import {authCheck} from '../../auth/auth-check';
import {MainMenu} from '../../menu/menu-component';
import {UpdateTextfield} from '../../common/directives/update-textfield/update-textfield';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination';
import {SearchNode} from "../../common/model/node/search-node";

let _ = require('lodash');

@Component({
    template: require('./lexicon-detail.html'),
    styles: [require('./lexicon-detail.css'), require('../../app.css')],
    providers: [TagService, LexiconService, PaginationService],
    directives: [UpdateTextfield, MainMenu, CORE_DIRECTIVES, FORM_DIRECTIVES,PaginationControlsCmp],
    pipes: [PaginatePipe]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class LexiconDetail implements OnInit {

    lexicon: Lexicon;
    tags: Tag[];
    lexiconForm: ControlGroup;
    name: AbstractControl;
    description: AbstractControl;
    status: AbstractControl;
    statuses = ['active', 'deleted'];
    submitted: boolean = false;
    confirmDelete: boolean;
    searchNode: SearchNode;

    constructor(private _formBuilder: FormBuilder,
                private _lexiconService: LexiconService,
                private _tagService: TagService,
                private _routeParams: RouteParams,
                private _router: Router) {

    }

    ngOnInit() {
        console.log(`In OnInit in lexicon`);
        this.searchNode =  new SearchNode();
        let id = this._routeParams.get('id');
        if (id) {
            this.searchNode.lexicon = id;
        }
        console.log(`Search params are : ${JSON.stringify(this.searchNode)}`);
        this._tagService.getTags(this.searchNode).subscribe(
            data => {
                this.tags = data;
                this._init();
            }
        );
    }

    private _init() {
        let id = this._routeParams.get('id');
        if (id) {
            this._getLexicon(id);
        } else {
            this.lexicon = new Lexicon();
            this._initForm();
        }
    }
    private _initForm() {
        console.log('initiating form: ' + JSON.stringify(this.lexicon));
        this.lexiconForm = this._formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            status: ['', Validators.required]
        });

        this.name = this.lexiconForm.controls['name'];
        this.description = this.lexiconForm.controls['description'];
        this.status = this.lexiconForm.controls['status'];

    }

    _getLexicon(id: string) {
        this._lexiconService.getLexicon(id).subscribe(
            data => {
                this.lexicon = data;
                this._initForm();
            }
        );
    }

    deleteLexicon() {
        this.confirmDelete = true;
    }

    cancelDelete() {
        this.confirmDelete = false;
    }

    doDeleteLexicon() {
        this._lexiconService.deleteLexicon(this.lexicon)
            .subscribe(
                () => {
                    this.cancelDelete();
                    this._initForm();
                }
            );
    }

    removeTag(tagId: string) {
        console.log(`In removeTag in Lexicon - ${tagId}`);
    }

    submitLexicon(value) {

        this.submitted = true;
        console.log(`in submitLexicon - ${this.lexiconForm.valid}`);
        if (this.lexiconForm.valid) {
            this._lexiconService.saveLexicon(this.lexicon).subscribe(
                () => {
                    this._router.navigate(['LexiconDetail', {id: this.lexicon._id}]);
                }
            );
        } else {

            console.log(`Name is ${this.name.value} ${this.name.valid}`);
            console.log(`Description is ${this.description.value} ${this.description.valid}`);

        }
    }

    cancel($event) {
        $event.preventDefault();
        this._router.navigate(['LexiconList']);
    }

}
